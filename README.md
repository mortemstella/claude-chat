# Claude Chat Web

A minimal web interface for chatting with Claude via the Anthropic API.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Export your API key:

```bash
export ANTHROPIC_API_KEY="your-key"
```

3. (Optional) Choose a model:

```bash
export CLAUDE_MODEL="claude-3-5-sonnet-20240620"
```

4. Start the server:

```bash
npm start
```

Open `http://localhost:3000` in your browser.

## API

The frontend sends the full message history to `POST /api/chat` which forwards it to the Anthropic `v1/messages` API.
