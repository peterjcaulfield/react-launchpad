import { describe, it, expect, vi } from "vitest";
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'
import 'vitest-dom/extend-expect';

import { LaunchPad } from './LaunchPad';
import { Command, LaunchPadProps, onSelectCallback } from "./types";
import { useState } from "react";

const interactions = {
  upArrow: () => userEvent.keyboard('{arrowup}'),
  downArrow: () => userEvent.keyboard('{arrowdown}'),
  tab: (shift = false) => userEvent.tab({ shift }),
  shiftTab: () => userEvent.keyboard('{shift}{tab}{/shift}'),
  toggleModal: () => userEvent.keyboard('{meta>}k{/meta}'),
  enter: () => userEvent.keyboard('[Enter]'),
  click: (text: string) => userEvent.click(screen.getByText(text)),
  type: (text: string) => userEvent.type(screen.getByRole('textbox'), text),
}


const MOCK_commands: Command[] = [
  {
    text: 'command 1',
    onSelect: vi.fn()
  },
  {
    text: 'command 2',
    onSelect: vi.fn()
  },
  {
    text: 'command 3',
    onSelect: vi.fn()
  },
];

const renderComponent = (props: Partial<LaunchPadProps> = {}) =>
  render(
    <LaunchPad animate={false} commands={MOCK_commands} {...props} />
  )

// @ts-expect-error
HTMLElement.prototype.getBoundingClientRect = function() {
  if (this.classList.contains("results-container")) {
    return {
      width: 100,
      height: 400,
      top: 0,
      left: 0,
      bottom: 400,
      right: 100,
    };
  }
  return {
    width: 100,
    height: 35, // default command height
    top: 0,
    left: 0,
    bottom: 35,
    right: 100,
  };
};


describe('LaunchPad', () => {
  it('Using key binding toggles modal', async () => {
    renderComponent();
    await interactions.toggleModal();
    expect(screen.getByText('command 1')).toBeInTheDocument();
    await interactions.toggleModal();
    expect(() => screen.getByText('command 1')).toThrow();
  });

  it('Using arrow keys navigates commands', async () => {
    renderComponent();
    await interactions.toggleModal();
    await interactions.downArrow();
    expect(screen.getByRole('button', { name: 'command 2' })).toHaveAttribute('aria-selected', 'true');
    await interactions.upArrow();
    expect(screen.getByRole('button', { name: 'command 1' })).toHaveAttribute('aria-selected', 'true');

  });

  it('Using tab key navigates commands', async () => {
    renderComponent();
    await interactions.toggleModal();
    await interactions.tab();
    expect(screen.getByRole('button', { name: 'command 2' })).toHaveAttribute('aria-selected', 'true');
    await interactions.tab(true);
    expect(screen.getByRole('button', { name: 'command 1' })).toHaveAttribute('aria-selected', 'true');

  });

  it('Navigating past last command returns focus to first command', async () => {
    renderComponent();
    await interactions.toggleModal();
    await interactions.downArrow();
    await interactions.downArrow();
    await interactions.downArrow(); // should be back to 1 now
    expect(screen.getByRole('button', { name: 'command 1' })).toHaveAttribute('aria-selected', 'true');

  });

  it('Navigating before first command moves focus to last command', async () => {
    renderComponent();
    await interactions.toggleModal();
    await interactions.upArrow();
    expect(screen.getByRole('button', { name: 'command 3' })).toHaveAttribute('aria-selected', 'true');

  });

  it('Searching a value filters results', async () => {
    renderComponent();
    await interactions.toggleModal();
    await interactions.type('3');
    expect(screen.getByText('command 3')).toBeInTheDocument();
    expect(screen.getByRole('listbox').children.length).toEqual(1);

  });

  it('initialCommands are rendered if set and search input is blank', async () => {
    const initialCommands: Command[] = [
      { text: 'FOO', onSelect: vi.fn() }
    ];
    renderComponent({ initialCommands });
    await interactions.toggleModal();
    expect(screen.getByRole('listbox').children.length).toEqual(1);
    expect(screen.getByText('FOO')).toBeInTheDocument();
  });

  it('Hitting enter on command invokes onSelect for command', async () => {

    const mockCommand = { text: 'FOO', onSelect: vi.fn() }
    const commands: Command[] = [
      mockCommand
    ];
    renderComponent({ commands });
    await interactions.toggleModal();
    await interactions.enter();
    expect(mockCommand.onSelect).toHaveBeenCalled();
  });

  it('Clicking on command invokes onSelect for command', async () => {
    const mockCommand = { text: 'FOO', onSelect: vi.fn() }
    const commands: Command[] = [
      mockCommand
    ];
    renderComponent({ commands });
    await interactions.toggleModal();
    await interactions.click('FOO');
    expect(mockCommand.onSelect).toHaveBeenCalled();
  });

  it('onSearchSelect allows specifying callback for search input when no result is matched', async () => {
    const onSearchSelect = vi.fn();
    renderComponent({ onSearchSelect });
    await interactions.toggleModal();
    await interactions.type('X');
    await interactions.enter();
    expect(onSearchSelect).toHaveBeenCalled();

  });

  it('onSelect public context allows you to set loading and open state', async () => {
    const onSearchSelect: onSelectCallback = (context) => {
      context.setLoading(true);
      setTimeout(() => {
        context.setLoading(false);
      }, 100);

    };
    renderComponent({ onSearchSelect });
    await interactions.toggleModal();
    await interactions.type('X');
    await interactions.enter();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    waitFor(
      () => expect(screen.getByRole('progressbar')).not.toBeInTheDocument()
    )
    waitFor(
      () => expect(screen.getByText('X')).not.toBeInTheDocument()
    )
  });

  it('onSelect public context allows you to set error state', async () => {

    const onSearchSelect: onSelectCallback = (context) => {
      context.setError('BOOM!');
    };
    renderComponent({ onSearchSelect });
    await interactions.toggleModal();
    await interactions.type('X');
    await interactions.enter();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('onRenderCommand', async () => {
    const mockCommand = {
      text: 'FOO', onSelect: vi.fn(), extra: {
        summary: 'This is a summary',
      }
    }
    const commands: Command[] = [
      mockCommand
    ];

    const onRenderCommand = (command: Command) => {
      return <>
        <div>{command.text}</div>
        <div>{command.extra.summary as string}</div>
      </>
    }

    renderComponent({ commands, onRenderCommand });
    await interactions.toggleModal();
    expect(screen.getByText('This is a summary')).toBeInTheDocument();
  });

  it('onChange', async () => {
    const TestWrapper = () => {
      const [commands, setcommands] = useState(MOCK_commands);
      const onChange = (val: string) => {
        if (!val) {
          setcommands(MOCK_commands);
        };

        setcommands(MOCK_commands.filter(command => command.text.indexOf(val) !== -1))
      }
      return <LaunchPad commands={commands} onChange={onChange} />
    }

    render(<TestWrapper />);

    await interactions.toggleModal();
    await interactions.type('3');

    expect(screen.getByRole('listbox').children.length).toEqual(1);
    expect(screen.getByText('command 3')).toBeInTheDocument();
  });
});
