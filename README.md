<div align="center">
  <img src="./icon.webp" width="75" alt="icon" />
  <h1>React Launchpad</h1>
</div>


A React library to help you create a slack-like command pane customised to your application.

*Note:* This library is still under heavy development. API is stabilising and subject to change. 

![Demo of React Launchpad](./demo.gif)

## Features

- Slack-like UX
- List virtualisation for better performance
- Fuzzy matching
- Theming

## Installation

```sh
npm install react-launchpad
```

## Quick Start

Add stylesheet and component to your app:

```tsx
import "react-launchpad/dist/styles.css";

import { HomeIcon } from "@heroicons/react/24/solid";
import { LaunchpadContext } from 'react-launchpad';

// ...snip
const router = useRouter();

const commands = useMemo(() => {
  return [
    {
      icon: <HomeIcon/>,
      text: 'Home',
      onSelect: (context: LaunchpadContext) => {
        router.push('/')
        context.setOpen(false);
      }
    },
  ];

}, [router])

// ...snip
  return (
    <body>
      <Launchpad
          commands={commands}
      >
        <main>{children}</main>
      </LaunchPad>
    </body>
  );
```
