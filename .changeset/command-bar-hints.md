---
"@bhodgson/design-system": minor
---

The command bar hints like a shell. The prompt colours what's typed, with the command in the accent colour and an unknown one in red, and shows what Tab would complete to faded after it, as in fish; Tab or → at the end takes it. With no completion from the command, a prefix of exactly one command's name completes to it. The output no longer repeats the command, and starts under the prompt, as a terminal's does. In `help`, a usage's `<placeholders>` and `|` choices are muted. In a string `message`, and in a command's `description`, text in backticks is shown as a command, or as a key when it names one, such as `Enter`.
