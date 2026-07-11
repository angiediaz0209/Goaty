// Full lesson content for every roadmap node.
// Structure follows the "Goaty Curriculum" spec: header, learning goal, story,
// explanation, visual analogy, examples, challenge, solution, tip, fun fact,
// mistakes, mini-quiz, rewards, unlock message.
// Text with {interest} tokens is replaced at render time via personalize().

export const LESSONS = {
  n1: {
    id: 'n1',
    title: 'Variables & the Hero\'s Backstory',
    subtitle: 'Store information inside your program.',
    estimatedTime: 5,
    difficulty: 'Easy',
    xpReward: 50,
    mascotMood: 'excited',
    learningGoal:
      "By the end of this lesson you'll know what a variable is, how to create one, and why they're the foundation of every program you'll ever write.\n\nVariables let your app remember things — a score, a username, a favorite {interest} character.\n\nYou'll use them in every single lesson from here on out.",
    story:
      "Imagine you're the coach of your favorite {interest} team.\n\nEvery player has a jersey number… but who remembers all those numbers?\n\nInstead, you give every player a name. \"Pass to Messi.\" \"Send in Naruto.\" \"Yo, Ash — you're up.\"\n\nThat's exactly what variables do — they give names to information so you can find it later.",
    explanation:
      "A variable is a labeled box. You put something inside, slap a name on it, and any time you need that thing you just call the name.\n\nIn JavaScript we make a box with the word `let`, followed by a name, an equals sign, and the value.\n\nThat's it. That's the whole idea. You just leveled up.",
    visualAnalogy:
      "📦 A cardboard box with 'score' written on the side. Peek inside → 28. Whenever you need the score, just open the 'score' box.",
    examples: [
      {
        code: 'let score = 10;',
        explain: "`let` says: hey, make me a new box.\n`score` is the label we're writing on the box.\n`=` is the tape — we're putting something inside.\n`10` is what goes in the box."
      },
      {
        code: 'let favoritePlayer = "{interestExample}";',
        explain: "Now we have a box called `favoritePlayer` with your {interest} pick inside. You can read it any time by writing `favoritePlayer`."
      }
    ],
    challenge: {
      prompt: "Create a variable called `powerLevel` and store the number `9001` inside it.",
      placeholder: 'let powerLevel = …'
    },
    solution: {
      code: 'let powerLevel = 9001;',
      explain: "Boom — you gave 9001 a home. Now anywhere in your program you can say `powerLevel` and JavaScript instantly knows you mean 9001."
    },
    goatyTip: 'Small lessons every day beat giant study sessions. Show up daily and the streak does the work. 🐐',
    funFact: 'The first ever "variable" in a computer was literally a physical switch flipped up or down in a room-sized machine in the 1940s. You just wrote one with 3 words.',
    commonMistakes: [
      'Forgetting the quotes around text values ("Messi" not Messi).',
      'Misspelling the name — `score` and `Score` are two different boxes.',
      'Putting a space inside the name (use `favoritePlayer`, not `favorite player`).',
    ],
    quiz: [
      { q: 'What does `let` do in JavaScript?', choices: ['Runs a function', 'Creates a new variable', 'Prints to the screen', 'Deletes a value'], correct: 1, explain: '`let` is how we start a new labeled box.' },
      { q: 'True or False: variable names can have spaces.', choices: ['True', 'False'], correct: 1, explain: 'No spaces! Use camelCase like `favoritePlayer`.' },
      { q: 'Fill the blank: `let score ___ 10;`', choices: [':', '=', '==', '->'], correct: 1, explain: 'A single `=` puts a value into the box.' },
      { q: 'Which is a valid variable name?', choices: ['1player', 'my score', 'topScore', 'let'], correct: 2, explain: '`topScore` follows the rules — starts with a letter, no spaces, not a reserved word.' },
      { q: 'What goes inside quotes?', choices: ['Numbers', 'Text (strings)', 'Nothing', 'Only variable names'], correct: 1, explain: 'Text values (called strings) go inside quotes.' },
    ],
    unlockNext: 'Functions as Special Moves',
  },

  n2: {
    id: 'n2',
    title: 'Functions as Special Moves',
    subtitle: 'Reusable powers you can cast anywhere.',
    estimatedTime: 6,
    difficulty: 'Easy',
    xpReward: 60,
    mascotMood: 'hype',
    learningGoal:
      "You'll learn what a function is, how to build one, and how to trigger it.\n\nFunctions are how you avoid writing the same code ten times.\n\nMaster this and you basically speak the language.",
    story:
      "Think about your favorite {interest} hero.\n\nWhen they need to win, they don't reinvent their signature move — they call it. Kamehameha. Rasengan. Fireball. Sneaky corner shot.\n\nA function is that signature move. You define it once, then anywhere you want to unleash it, you just say its name.",
    explanation:
      "A function has three parts:\n\n1. A name.\n2. A block of code (the move).\n3. Parentheses `()` you use to \"cast\" it.\n\nWhen you call the function, everything inside runs. It's that simple.",
    visualAnalogy:
      "Think of a big red button labeled `sayHi`. Every time you press it, a speech bubble pops up saying \"Hi!\". That button IS a function.",
    examples: [
      {
        code: 'function sayHi() {\n  console.log("Hi!");\n}\n\nsayHi();',
        explain: "`function sayHi()` defines the move.\nThe `{ }` holds what the move does.\n`sayHi()` at the bottom is you pressing the button."
      },
      {
        code: 'function cheer(name) {\n  console.log("Let\'s go " + name + "!");\n}\n\ncheer("{interestExample}");',
        explain: "Now our function takes a `name` — that's an input. When we cast `cheer(\"{interestExample}\")` it prints a shoutout tailored to your {interest} fave."
      }
    ],
    challenge: {
      prompt: 'Write a function called `powerUp` that prints "Powering up!" when called.',
      placeholder: 'function powerUp() { … }'
    },
    solution: {
      code: 'function powerUp() {\n  console.log("Powering up!");\n}\n\npowerUp();',
      explain: 'Define it once, call it any time you need that vibe.'
    },
    goatyTip: 'If you catch yourself copy-pasting code, that\'s the universe asking you to make a function. 🐐',
    funFact: 'The word "function" comes from math — but in code, functions can also just DO things, not only calculate.',
    commonMistakes: [
      'Forgetting the parentheses when calling: `sayHi` doesn\'t run, `sayHi()` does.',
      'Missing the curly braces `{ }` around the function body.',
      'Typo in the function name when calling it.',
    ],
    quiz: [
      { q: 'How do you call a function named greet?', choices: ['greet', 'greet()', 'call greet', 'run greet'], correct: 1, explain: 'Parentheses trigger the function.' },
      { q: 'What keyword starts a function?', choices: ['let', 'const', 'function', 'run'], correct: 2, explain: '`function` declares one.' },
      { q: 'True or False: a function can be called many times.', choices: ['True', 'False'], correct: 0, explain: 'That\'s the point — write once, use forever.' },
      { q: 'What goes inside the parentheses when you define a function?', choices: ['Nothing ever', 'Inputs (parameters)', 'The answer', 'Comments only'], correct: 1, explain: 'Parameters are the inputs your function accepts.' },
      { q: 'Fill the blank: `function ___() { … }`', choices: ['a name', 'a number', 'a color', 'a semicolon'], correct: 0, explain: 'Functions need names so you can call them later.' },
    ],
    unlockNext: 'Power Level Check-in',
  },

  n3: {
    id: 'n3',
    title: 'Power Level Check-in',
    subtitle: 'A quick quiz to lock in what you know.',
    estimatedTime: 5,
    difficulty: 'Easy',
    xpReward: 45,
    mascotMood: 'focused',
    learningGoal:
      "Quick check-in on variables and functions.\n\nNo new content — this is your training gym.\n\nAce it and unlock the next arc.",
    story:
      "Every {interest} hero has that moment before the big fight — a checkpoint. A moment to see if the training stuck.\n\nThis is yours. Take a breath. You've got this.",
    explanation:
      "Answer the 5 questions below. You can miss some — Goaty will explain each one either way.",
    visualAnalogy:
      "🥋 A dojo mat. Sensei bows. Show your form. You already trained — this is just the demo.",
    examples: [
      { code: 'let hp = 100;', explain: 'Variable. Named box called `hp` holding 100.' },
      { code: 'function heal() { hp = hp + 20; }', explain: 'Function that adds 20 to `hp` every time it\'s called.' }
    ],
    challenge: {
      prompt: 'No coding this round — just the quiz below. Ready?',
      placeholder: '(quiz only)'
    },
    solution: { code: '(see quiz)', explain: 'Every answer explains itself when you click it.' },
    goatyTip: 'Wrong answers teach 3× more than right ones. Miss loudly, learn quickly. 🐐',
    funFact: 'The word "quiz" was invented as a bet — a Dublin theatre owner in 1791 supposedly paid kids to chalk the nonsense word on walls overnight.',
    commonMistakes: [
      'Rushing the read — questions are short, take the extra second.',
      'Overthinking — first instinct usually wins.',
      'Skipping the explanation after you answer.',
    ],
    quiz: [
      { q: 'Which keyword creates a variable?', choices: ['make', 'let', 'define', 'variable'], correct: 1, explain: '`let` is the go-to.' },
      { q: 'How do you call a function named `attack`?', choices: ['attack;', 'attack()', 'call attack', 'run attack'], correct: 1, explain: 'Parens trigger it.' },
      { q: 'True or False: `Score` and `score` are the same variable.', choices: ['True', 'False'], correct: 1, explain: 'JavaScript is case-sensitive.' },
      { q: 'What does `console.log("hi")` do?', choices: ['Deletes a file', 'Prints "hi"', 'Makes a variable', 'Nothing'], correct: 1, explain: 'It prints to the developer console.' },
      { q: 'Fill in: `___ score = 10;`', choices: ['let', 'if', 'return', 'call'], correct: 0, explain: '`let` starts a variable.' },
    ],
    unlockNext: 'Loops = Training Montages',
  },

  n4: {
    id: 'n4',
    title: 'Loops = Training Montages',
    subtitle: 'Repeat the drill until it\'s muscle memory.',
    estimatedTime: 7,
    difficulty: 'Easy',
    xpReward: 70,
    mascotMood: 'grind',
    learningGoal:
      "You'll learn how to make code repeat itself with a `for` loop.\n\nLoops save you from writing the same line 100 times.\n\nPerfect for any app that touches lists.",
    story:
      "Every training montage in {interest} goes the same way: hero repeats one drill over and over — sunrise to sunset — until it clicks.\n\nA `for` loop is that montage.\n\nSet the starting rep, set the finish line, and JavaScript grinds it out for you.",
    explanation:
      "A `for` loop has three parts inside its parentheses:\n\n1. **Start** — where the counter begins.\n2. **Condition** — keep going while this is true.\n3. **Step** — how the counter changes each round.",
    visualAnalogy:
      "🎬 A movie montage counter in the corner: Day 1 → Day 2 → Day 3 → …until training ends. That counter is your loop variable.",
    examples: [
      {
        code: 'for (let i = 1; i <= 3; i++) {\n  console.log("Rep " + i);\n}',
        explain: 'Starts at 1, keeps going while i ≤ 3, adds 1 each time. Prints "Rep 1", "Rep 2", "Rep 3".'
      },
      {
        code: 'let heroes = ["{interestExample}", "Naruto", "Luffy"];\nfor (let i = 0; i < heroes.length; i++) {\n  console.log(heroes[i]);\n}',
        explain: 'Loops through every hero in the list and prints their name one by one.'
      }
    ],
    challenge: {
      prompt: 'Print the numbers 1 through 5 using a for loop.',
      placeholder: 'for (let i = 1; i <= 5; i++) { … }'
    },
    solution: {
      code: 'for (let i = 1; i <= 5; i++) {\n  console.log(i);\n}',
      explain: 'Counter starts at 1, stops after 5, increases by 1 each round.'
    },
    goatyTip: 'When you see repetition, think loop. Copy-paste is a code smell. 🐐',
    funFact: 'The tiny `i` in `for` loops originally stood for "index" — a math nod from the 1950s. You\'re using vintage code.',
    commonMistakes: [
      'Off-by-one: using `i <= length` instead of `i < length` on arrays.',
      'Forgetting to change `i` — infinite loop!',
      'Using the wrong variable name inside the loop.',
    ],
    quiz: [
      { q: 'What does a loop do?', choices: ['Runs code once', 'Runs code many times', 'Deletes code', 'Prints code'], correct: 1, explain: 'Loops repeat.' },
      { q: 'What does `i++` mean?', choices: ['i minus 1', 'i plus 1', 'i times 2', 'reset i'], correct: 1, explain: 'Shorthand for `i = i + 1`.' },
      { q: 'True or False: a for-loop can run zero times.', choices: ['True', 'False'], correct: 0, explain: 'If the condition is already false, the body never runs.' },
      { q: 'What is the first index in an array?', choices: ['0', '1', '-1', 'undefined'], correct: 0, explain: 'Arrays start counting at 0.' },
      { q: 'Fill: `for (let i = 0; i ___ 5; i++)` to run 5 times.', choices: ['==', '<', '<=', '>'], correct: 1, explain: '`<` gives you 0,1,2,3,4 — that\'s 5 rounds.' },
    ],
    unlockNext: 'Arrays: Your Party Members',
  },

  n5: {
    id: 'n5',
    title: 'Arrays: Your Party Members',
    subtitle: 'A list of things, all in one place.',
    estimatedTime: 6,
    difficulty: 'Easy',
    xpReward: 60,
    mascotMood: 'friendly',
    learningGoal:
      "You'll learn what an array is, how to make one, and how to grab items from it.\n\nArrays are how programs hold lists — songs, players, messages, everything.",
    story:
      "In every {interest} adventure, the hero is stronger with a party. A team. A squad.\n\nAn array is your party — one line of code that holds all your teammates in order.",
    explanation:
      "Arrays use square brackets `[ ]`. Items inside are separated by commas.\n\nEach item has a position (called an index) starting at **0**. Yes, zero. Programmers count from zero.",
    visualAnalogy:
      "🎒 A backpack with numbered pockets. Pocket 0 has your sword, pocket 1 has your potion, pocket 2 has snacks. Same idea.",
    examples: [
      {
        code: 'let party = ["{interestExample}", "Luffy", "Ash"];',
        explain: 'A party of three. `party[0]` is your first fave, `party[1]` is Luffy, and so on.'
      },
      {
        code: 'console.log(party.length);',
        explain: '`.length` tells you how many items are in the array.'
      }
    ],
    challenge: {
      prompt: 'Make an array called `snacks` with three of your favorite foods.',
      placeholder: 'let snacks = [ … ]'
    },
    solution: {
      code: 'let snacks = ["pizza", "ramen", "mango"];',
      explain: 'Boom, backpack packed.'
    },
    goatyTip: 'Arrays love loops. If you\'re looking at a list, a loop is coming next. 🐐',
    funFact: 'Arrays are older than the internet — the concept goes back to the 1950s FORTRAN language.',
    commonMistakes: [
      'Forgetting the brackets — `[` and `]`.',
      'Using index `1` for the first item. It\'s `0`.',
      'Forgetting commas between items.',
    ],
    quiz: [
      { q: 'What symbols wrap an array?', choices: ['{ }', '[ ]', '( )', '< >'], correct: 1, explain: 'Square brackets.' },
      { q: 'What is the first index?', choices: ['0', '1', '-1', 'any'], correct: 0, explain: 'Zero-based indexing.' },
      { q: 'True or False: arrays can hold different types (numbers + strings).', choices: ['True', 'False'], correct: 0, explain: 'In JavaScript, yes they can.' },
      { q: 'How do you get the length?', choices: ['array.size', 'array.length', 'array.count', 'array.total'], correct: 1, explain: '`.length` is the property.' },
      { q: 'Fill: `let list = ___;` for an empty array', choices: ['[]', '{}', '()', 'null'], correct: 0, explain: 'Empty brackets = empty array.' },
    ],
    unlockNext: 'Build a Character Roster App',
  },

  n6: {
    id: 'n6',
    title: 'Build a Character Roster App',
    subtitle: 'Mini project — put it all together.',
    estimatedTime: 8,
    difficulty: 'Easy',
    xpReward: 120,
    mascotMood: 'proud',
    learningGoal:
      "You'll combine variables, functions, arrays, and loops to build something real.\n\nThis is your first project. It's small but it counts.",
    story:
      "You just got hired as a fansite dev for your favorite {interest} universe. Your first task: show a scrolling list of every character with their name and power level.\n\nToday you ship v1.",
    explanation:
      "The recipe:\n\n1. Store characters in an **array** of objects.\n2. Write a **function** that prints one character.\n3. Use a **loop** to print all of them.\n\nThat's the whole app.",
    visualAnalogy:
      "🎴 Trading cards laid out on a table. Each card = one character. Your program flips them over one by one and reads them aloud.",
    examples: [
      {
        code: 'let roster = [\n  { name: "{interestExample}", power: 9000 },\n  { name: "Naruto", power: 8500 },\n];',
        explain: 'An array of little info-packets (called objects).'
      },
      {
        code: 'function printCard(c) {\n  console.log(c.name + " — " + c.power);\n}\n\nfor (let i = 0; i < roster.length; i++) {\n  printCard(roster[i]);\n}',
        explain: 'One function, one loop, all cards printed. That\'s the app.'
      }
    ],
    challenge: {
      prompt: 'Add a 3rd character to `roster` and print all three.',
      placeholder: '// add one and run the loop'
    },
    solution: {
      code: 'roster.push({ name: "Luffy", power: 9500 });\n\nfor (let i = 0; i < roster.length; i++) {\n  printCard(roster[i]);\n}',
      explain: '`.push()` adds to the end of an array. The existing loop handles the rest.'
    },
    goatyTip: 'Shipping something small every week beats a "perfect" project you never finish. 🐐',
    funFact: 'Instagram was originally a check-in app before its creators shipped a tiny photo feature. That tiny feature became a $1B company.',
    commonMistakes: [
      'Forgetting the commas between objects in an array.',
      'Mixing up `.push()` (adds to end) and `.pop()` (removes from end).',
      'Trying to loop past the array length.',
    ],
    quiz: [
      { q: 'How do you add to an array?', choices: ['array.add()', 'array.push()', 'array.new()', 'array++'], correct: 1, explain: '`.push()` appends to the end.' },
      { q: 'What holds many named values together?', choices: ['array', 'object', 'string', 'number'], correct: 1, explain: 'An object bundles named fields.' },
      { q: 'True or False: arrays can hold objects.', choices: ['True', 'False'], correct: 0, explain: 'Absolutely — arrays of objects are everywhere.' },
      { q: 'What accesses `.name` on object `c`?', choices: ['c-name', 'c(name)', 'c.name', 'c[name]'], correct: 2, explain: 'Dot notation is standard.' },
      { q: 'Fill: `for (let i = 0; i < roster.___; i++)`', choices: ['size', 'length', 'count', 'total'], correct: 1, explain: '`.length` on arrays.' },
    ],
    unlockNext: 'Arc One Complete',
  },

  n7: {
    id: 'n7',
    title: 'Arc One Complete',
    subtitle: 'You just finished your first arc.',
    estimatedTime: 3,
    difficulty: 'Easy',
    xpReward: 100,
    mascotMood: 'proud',
    learningGoal:
      "Take a beat. Look at how much you learned.\n\nEvery big-time coder started exactly here.",
    story:
      "Every {interest} arc ends with a moment of quiet before the next chapter.\n\nThis is yours. Streak up. Head up. Let's keep going.",
    explanation:
      "You now know variables, functions, loops, arrays, and objects — the entire foundation of JavaScript.\n\nEverything from here on is remixes of these.",
    visualAnalogy:
      "🏆 Trophy on a shelf. Small trophy — but the FIRST trophy. And the shelf has a lot of empty spots waiting.",
    examples: [
      { code: 'let progress = "unstoppable";', explain: 'A variable that describes you now.' }
    ],
    challenge: {
      prompt: 'Tell Goaty one thing that clicked for you in this arc. (Take a moment to reflect.)',
      placeholder: 'The thing that clicked was…'
    },
    solution: { code: '// no wrong answer here', explain: "Reflection is training. Coming back tomorrow is training. You're doing it." },
    goatyTip: 'Milestones matter. Screenshot this page — future you will smile. 🐐',
    funFact: 'The average dev quits their first tutorial in under 20 minutes. You already did more today.',
    commonMistakes: [
      'Skipping celebration and jumping straight to the next thing.',
      'Comparing your day 7 to someone else\'s year 7.',
      'Not sharing progress with anyone.',
    ],
    quiz: [
      { q: 'Which came first in this arc?', choices: ['Arrays', 'Variables', 'Loops', 'Objects'], correct: 1, explain: 'Variables — the labeled box.' },
      { q: 'True or False: functions can be called many times.', choices: ['True', 'False'], correct: 0, explain: 'That\'s their whole superpower.' },
      { q: 'What symbol wraps an array?', choices: ['[]', '{}', '()', '<>'], correct: 0, explain: 'Square brackets.' },
      { q: 'What loops through items in order?', choices: ['if', 'for', 'let', 'return'], correct: 1, explain: '`for` loops.' },
      { q: 'Which feels true right now?', choices: ['I quit', 'I\'m stuck', 'I\'m growing', 'I\'m confused'], correct: 2, explain: 'Growth is the correct answer, every time. 🐐' },
    ],
    unlockNext: 'Objects: Character Sheets',
  },

  n8: {
    id: 'n8',
    title: 'Objects: Character Sheets',
    subtitle: 'Bundle related info into one clean package.',
    estimatedTime: 6,
    difficulty: 'Easy',
    xpReward: 70,
    mascotMood: 'curious',
    learningGoal:
      "You'll learn to group related values under one name using an object.\n\nObjects power almost every real app on Earth.",
    story:
      "In {interest}, every hero has a character sheet: name, level, moves, hometown, catchphrase.\n\nAn object is that character sheet in code form.",
    explanation:
      "Objects use curly braces `{ }`. Inside, you write `key: value` pairs separated by commas.\n\nRead a value with **dot notation**: `hero.name`.",
    visualAnalogy:
      "🪪 A trading-card back cover. Name, HP, moves, stats — all on one card. Flip and read whichever line you need.",
    examples: [
      {
        code: 'let hero = {\n  name: "{interestExample}",\n  level: 12,\n  move: "Signature Kick"\n};',
        explain: 'One object holding three related facts about the hero.'
      },
      {
        code: 'console.log(hero.name);   // "{interestExample}"\nconsole.log(hero.level); // 12',
        explain: 'Dot notation reads a single field from the card.'
      }
    ],
    challenge: {
      prompt: 'Create an object `pet` with keys `name`, `type`, and `age`.',
      placeholder: 'let pet = { … }'
    },
    solution: {
      code: 'let pet = { name: "Goaty", type: "goat", age: 2 };',
      explain: 'Three keys, three values — one tidy object.'
    },
    goatyTip: 'If two variables always travel together, glue them into an object. 🐐',
    funFact: 'The `{}` symbols were called "curly brackets" until programmers, tired of typing that, started calling them "braces." Both are correct.',
    commonMistakes: [
      'Forgetting the comma between key-value pairs.',
      'Using `=` inside the object — should be `:`.',
      'Trying to read a key that doesn\'t exist (you get `undefined`).',
    ],
    quiz: [
      { q: 'What symbol wraps an object?', choices: ['[]', '{}', '()', '""'], correct: 1, explain: 'Curly braces.' },
      { q: 'What separates key and value?', choices: ['=', ':', '->', '/'], correct: 1, explain: 'A colon.' },
      { q: 'True or False: objects hold named values.', choices: ['True', 'False'], correct: 0, explain: 'That\'s the whole point.' },
      { q: 'How do you read `.name` on object `hero`?', choices: ['hero-name', 'hero.name', 'hero->name', 'name.hero'], correct: 1, explain: 'Dot notation.' },
      { q: 'Fill: `let pet = { name: ___ };`', choices: ['"Goaty"', 'Goaty', '=Goaty', ':Goaty'], correct: 0, explain: 'Text values need quotes.' },
    ],
    unlockNext: 'Mid-Season Finals',
  },

  n9: {
    id: 'n9',
    title: 'Mid-Season Finals',
    subtitle: 'Big quiz. Show what you\'ve got.',
    estimatedTime: 6,
    difficulty: 'Easy',
    xpReward: 80,
    mascotMood: 'fire',
    learningGoal:
      "Prove that variables, functions, loops, arrays, and objects all live in your head now.",
    story:
      "Every {interest} mid-season episode has THE test — the one that separates arcs.\n\nYou're already dressed for it. Deep breath. Let's go.",
    explanation:
      "Answer the 5 questions below. If any feel shaky, hop back and re-do that lesson — nobody's judging.",
    visualAnalogy:
      "⚡ Stadium lights on. Crowd hushed. First serve.",
    examples: [
      { code: '// no new code — you already know this', explain: 'This is a review. You got this.' }
    ],
    challenge: {
      prompt: 'Quiz below. No code editor this round.',
      placeholder: '(quiz only)'
    },
    solution: { code: '(each quiz answer explains itself)', explain: 'Read the explanation after every answer — that\'s where the gold is.' },
    goatyTip: 'Confidence is built in reps, not vibes. This is a rep. 🐐',
    funFact: 'The word "exam" comes from the Latin for "the tongue of a scale" — a tool for weighing. Weigh yourself, then adjust.',
    commonMistakes: [
      'Rushing the last question because you\'re tired.',
      'Not reading all the choices.',
      'Skipping the explanation once you got it right.',
    ],
    quiz: [
      { q: 'Which creates a variable in modern JS?', choices: ['var only', 'let', 'define', 'variable'], correct: 1, explain: '`let` (or `const`) is the modern way.' },
      { q: 'What runs a function called `play`?', choices: ['play', 'play()', 'call play', 'run play'], correct: 1, explain: 'Parens run it.' },
      { q: 'What symbol wraps an array?', choices: ['{}', '[]', '()', '<>'], correct: 1, explain: 'Square brackets.' },
      { q: 'What reads `.hp` on `hero`?', choices: ['hero-hp', 'hero.hp', 'hero->hp', 'get(hero, hp)'], correct: 1, explain: 'Dot notation.' },
      { q: 'True or False: array indexes start at 1.', choices: ['True', 'False'], correct: 1, explain: 'They start at 0.' },
    ],
    unlockNext: 'Battle Simulator',
  },

  n10: {
    id: 'n10',
    title: 'Battle Simulator',
    subtitle: 'Final project — build a mini game.',
    estimatedTime: 10,
    difficulty: 'Easy',
    xpReward: 150,
    mascotMood: 'legendary',
    learningGoal:
      "You'll build a tiny battle simulator using every concept from this roadmap.\n\nBy the end you'll have code that literally runs and prints a fight.\n\nThat's shipping.",
    story:
      "Your favorite {interest} character vs. Goaty. Turn-based. Console output. Real logic.\n\nWinner gets bragging rights forever.",
    explanation:
      "The plan:\n\n1. Two **objects** (hero and Goaty) with HP and a `move`.\n2. A **function** `attack(a, b)` that reduces b's HP.\n3. A **loop** that alternates attacks until someone hits 0.\n4. Print a fight log line by line.",
    visualAnalogy:
      "🎮 A retro 8-bit turn-based battle. HP bars ticking. Announcer yelling. All powered by 20 lines of code.",
    examples: [
      {
        code: 'let hero = { name: "{interestExample}", hp: 100 };\nlet goaty = { name: "Goaty", hp: 100 };',
        explain: 'Two fighters, each an object.'
      },
      {
        code: 'function attack(attacker, defender) {\n  let dmg = Math.floor(Math.random() * 20) + 5;\n  defender.hp -= dmg;\n  console.log(attacker.name + " hits for " + dmg + "!");\n}',
        explain: 'One function does the damage math, mutates the defender, and prints a play-by-play.'
      }
    ],
    challenge: {
      prompt: 'Write a loop that keeps running while both HPs are above 0, alternating attacks.',
      placeholder: 'while (hero.hp > 0 && goaty.hp > 0) { … }'
    },
    solution: {
      code: 'while (hero.hp > 0 && goaty.hp > 0) {\n  attack(hero, goaty);\n  if (goaty.hp <= 0) break;\n  attack(goaty, hero);\n}\nconsole.log(hero.hp > 0 ? hero.name + " wins!" : goaty.name + " wins!");',
      explain: 'The `while` loop keeps the fight going. `break` prevents an extra swing after someone falls. The final line prints the winner.'
    },
    goatyTip: 'Every big engineer started with a project this small. Ship it, share it, then build the next one. 🐐',
    funFact: 'The very first video game (Tennis for Two, 1958) ran on an oscilloscope with less code than you just wrote. You are officially a game dev.',
    commonMistakes: [
      'Forgetting to reduce HP inside `attack`.',
      'Infinite loop from forgetting to update HP.',
      'Announcing the winner before the loop finishes.',
    ],
    quiz: [
      { q: 'What loop runs while a condition is true?', choices: ['for', 'while', 'if', 'do'], correct: 1, explain: '`while` loops keep going until the condition flips.' },
      { q: 'What operator subtracts from a value in place?', choices: ['-=', '=-', '--', '=-'], correct: 0, explain: '`-=` is short for `x = x - y`.' },
      { q: 'True or False: random numbers come from `Math.random()`.', choices: ['True', 'False'], correct: 0, explain: 'Yes — returns a number between 0 and 1.' },
      { q: 'What stops a loop early?', choices: ['stop', 'break', 'exit', 'end'], correct: 1, explain: '`break` exits immediately.' },
      { q: 'What did you just do?', choices: ['Nothing', 'Built a game', 'Read a book', 'Watched a video'], correct: 1, explain: 'You literally built a game. Screenshot this. 🐐' },
    ],
    unlockNext: 'Advanced Roadmap: Coming Soon',
  },
}

// ---------- personalization ----------

// A tiny example bank per interest — swapped into `{interestExample}` tokens.
const EXAMPLE_BANK = {
  sports: 'Messi',
  anime: 'Goku',
  gaming: 'Master Chief',
  music: 'Taylor',
  cooking: 'Gordon',
  travel: 'Kyoto',
  books: 'Frodo',
  tv: 'Eleven',
  technology: 'Ada',
  default: 'your hero',
}

const LENS_LABEL = {
  sports: 'sports',
  anime: 'anime',
  gaming: 'gaming',
  music: 'music',
  cooking: 'cooking',
  travel: 'travel',
  books: 'books',
  tv: 'TV & film',
  technology: 'tech',
}

export function personalize(text, primaryInterest) {
  if (typeof text !== 'string') return text
  const key = primaryInterest && EXAMPLE_BANK[primaryInterest] ? primaryInterest : 'default'
  const example = EXAMPLE_BANK[key]
  const lens = LENS_LABEL[primaryInterest] || 'your favorite thing'
  return text
    .replaceAll('{interestExample}', example)
    .replaceAll('{interest}', lens)
}

export function getLesson(id) {
  return LESSONS[id] || null
}
