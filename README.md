# 🚀 SkillCaptain MCP Server

> **Train Your AI First Engineering Skills** - The official Model Context Protocol server that transforms how students learn programming with AI assistance.

![Version](https://img.shields.io/npm/v/skillcaptain-mcp-server)
![License](https://img.shields.io/npm/l/skillcaptain-mcp-server)
![Node](https://img.shields.io/node/v/skillcaptain-mcp-server)

## 🎓 Why This Exists?

The future belongs to **AI First Engineers** - developers who can effectively collaborate with AI to build better, faster, and smarter. Traditional programming courses teach you to code in isolation, but in the real world, you'll be working alongside AI assistants like Claude, ChatGPT, and Copilot.

**This MCP server bridges that gap** by giving you:
- ✨ **AI-powered learning** through Claude Desktop
- 🔄 **Real-time feedback** on your code submissions
- 📚 **Interactive coding practice** across 100+ problems
- 🎯 **Progressive skill building** from basics to advanced DSA

## 🌟 What Is AI First Engineering?

AI First Engineering means:
1. **Prompting** your AI to understand problems
2. **Collaborating** to design solutions
3. **Getting instant feedback** on code quality
4. **Iterating rapidly** to improve solutions
5. **Building production-ready code** faster than ever

**You're not just learning to code** - **you're learning to be 10x more productive.**

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ installed
- Claude Desktop app installed

### Installation

```bash
# Install the MCP server
npm install -g skillcaptain-mcp-server

# Or install locally
npm install skillcaptain-mcp-server
```

### Configuration

Add this to your Claude Desktop MCP configuration file:

**MacOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "skillcaptain": {
      "command": "npx",
      "args": ["-y", "skillcaptain-mcp-server"],
      "env": {}
    }
  }
}
```

**Or use the global installation directly:**
```json
{
  "mcpServers": {
    "skillcaptain": {
      "command": "skillcaptain-mcp",
      "args": [],
      "env": {}
    }
  }
}
```

**For local development**, use:
```json
{
  "mcpServers": {
    "skillcaptain": {
      "command": "node",
      "args": ["/path/to/skillcaptain-mcp/build/index.js"],
      "env": {}
    }
  }
}
```

After adding this, restart Claude Desktop.

## 📖 How to Use It

Once configured, you can interact with SkillCaptain directly through Claude Desktop!

### Example Usage

#### 1. Login to Your Account

```
You: "SkillCaptain, login with my credentials"

Claude: I need your email and password.

You: "hvardhan52@gmail.com, password: welcome"

Claude: ✅ Logged in! Your user ID is 12.
```

#### 2. Practice Binary Tree Problems

```
You: "I want to practice binary tree problems"

Claude: Found the "DSA: Binary Tree" course with 9 problems:
1. Day 1: Similar Leaf (Easy) - Check if two binary trees have the same leaf sequence
2. Day 2: Add Row (Medium) - Add a row of nodes at a given depth
3. Day 3: Right Side View (Medium) - Return values visible from the right
...and 6 more!

Which one should we start with?
```

#### 3. Get Problem Details

```
You: "Show me Day 1 problem"

Claude: 📋 Problem: Leaf-Similar Trees
Return true if two binary trees have the same leaf value sequence.

Examples:
- Example 1: root1=[3,5,1,6,2,9,8,null,null,7,4], root2=[3,5,1,6,7,4,2,...]
  Output: true (both have leaves [6,7,4,9,8])

Constraints:
- Nodes: 1-200
- Values: 0-200

Hint: Use DFS to collect leaf values, then compare sequences.
```

#### 4. Write and Test Code Locally

```
You: "Open a Python file with test cases"

Claude: Created similar_leaf.py with:
- TreeNode class
- build_tree_from_list helper
- 5 test cases (including examples from problem)

Write your solution and run: python similar_leaf.py
```

#### 5. Submit for Evaluation

```
You: "Submit the code"

Claude: Code submitted to SkillCaptain!

✅ Status: PASSED
✅ Code Quality: PASSED

Review highlights:
- Clear naming conventions
- Correct DFS implementation
- Good separation of concerns
- Handles edge cases properly

🎉 Solution accepted! Want to try another problem?
```

## 🎯 Full Feature Set

### Available Tools

1. **`login`** - Authenticate with your SkillCaptain account
2. **`list-courses`** - Browse all available courses
3. **`get-course-details`** - Get full course info with problems and progress
4. **`get-assignment-details`** - Get specific problem details with examples
5. **`submit-code`** - Submit solutions for automated evaluation
6. **`list-todo`** - Track your progress and TODO items

### Supported Languages

- ✅ Java (default)
- ✅ Python
- ✅ JavaScript
- ✅ C++

*More languages coming soon!*

## 🎓 Student Success Stories

### From Zero to Hero in 30 Days

**Sarah, CS Student**: *"I went from failing DSA exams to acing interviews by practicing with this AI assistant. The instant feedback helped me learn patterns I was missing."*

**Mike, Bootcamp Graduate**: *"Instead of wasting hours debugging, I learned to write better code from day one. The AI taught me coding best practices I would've taken months to figure out."*

**Priya, Career Switcher**: *"Coming from non-tech background, having Claude explain problems and review my code was like having a personal tutor 24/7. Landed my first dev job in 6 months!"*

## 🔥 Why Students Love This

| Traditional Learning | With SkillCaptain MCP |
|---------------------|----------------------|
| 🐌 Slow feedback loops | ⚡ Instant code review |
| 📖 Static documentation | 🤖 Interactive AI guidance |
| 😰 Fear of asking "dumb" questions | 💬 Safe AI conversations anytime |
| 📝 Limited test cases | ✅ Comprehensive examples |
| 😩 Debugging alone | 🤝 AI pair programming |

## 🛠️ Technical Details

### Architecture

This is a **Model Context Protocol (MCP) server** that:
- Bridges Claude Desktop ↔ SkillCaptain API
- Provides structured tool calling interface
- Handles authentication and session management
- Parses and formats responses for AI consumption

### Technology Stack

- **Runtime**: Node.js 18+
- **Language**: TypeScript
- **SDK**: @modelcontextprotocol/sdk
- **Protocol**: JSON-RPC 2.0 over stdio

### API Integration

Connects to SkillCaptain's learning platform:
- Course catalog and curriculum
- Assignment details and examples
- Code submission and evaluation
- Progress tracking

## 📦 Installation Methods

### Global Installation (Recommended)

```bash
npm install -g skillcaptain-mcp-server
```

### Local Installation

```bash
npm install skillcaptain-mcp-server
```

### Development Setup

```bash
git clone https://github.com/skillCaptain/skillcaptain-mcp.git
cd skillcaptain-mcp
npm install
npm run build
npm run dev
```

## 🤝 Contributing

Contributions welcome! Whether it's:
- 🐛 Bug reports
- 💡 Feature ideas
- 📝 Documentation improvements
- 🔧 Code contributions

Open an issue or submit a PR to make SkillCaptain better for everyone.

## 📄 License

MIT License - feel free to use this in your projects!

## 🔗 Links

- 🌐 **Website**: [skillcaptain.app](https://skillcaptain.app)
- 💬 **Community**: [Discord](https://discord.com/invite/AfGH5NPKgZ)
- 🐦 **Twitter**: [@skillcaptain](https://twitter.com/skill_captain)
- 📧 **Email**: hello@skillcaptain.app

## 🙏 Acknowledgments

Built with ❤️ by the SkillCaptain team to empower the next generation of AI First Engineers.

---

**Ready to level up your coding skills with AI? Install now and let Claude guide your journey from beginner to expert! 🚀**

```bash
npm install -g skillcaptain-mcp-server
```
