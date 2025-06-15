/**
 * App tips and educational content
 */

export const TIPS = [
  {
    category: "Frameworks",
    title: "React Best Practices",
    desc: "Learn how to optimize your React components for performance and maintainability.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB752F83TIMX8MYOc4bh2eW0P0HyhZl17Tf87iL3a24MpknuNqbbeWWEWhb3RlHxfXqGLT1tYkpj2_Fv9VWfjaFKidENDmZEHsCrqoQKv7P6oEVZqAm0xvZDL2_JkANCjEzJylEQXLIucVDTl0-iRlRHk59l5JQm42NYrT_saq--14GDZIiF3lbwGXfb2svF4MIa29Yxwe69wKojtqQWOF2hZpJkqYjohFtfLHI4hN5uRILAbt6_uV1UpUCOR1ArS_cBS4ca0fqMcZY",
  },
  {
    category: "Languages",
    title: "Python Efficiency Tips",
    desc: "Discover techniques to write cleaner and faster Python code.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9aljv3M9e2kZDkPpnfSOFdFCBlNoFjs8ZVE9ZIK0n6fR-W7_ZNEEgOJZQ1M1theTpcAPuuQeInlsNB-5TT3ofvW4IvvmRy0iBfyBpMmWWIoaZcSg0g5wBHjujR5Du_XjDdsyZ50fKHUhFjwJEFVrnhJw_kIlEx9OgTDPri4wQnDX76dbcFXPp-GfHLq7KQUZquS-QkDUPQ1gKZ7XqSICV_4nKFXDeHyO6iA9hQlKQV6BfeCmVmQuh30Q0YWeb8USBqEm-sFTjPKo5",
  },
  {
    category: "Tools",
    title: "Git Advanced Commands",
    desc: "Master Git with advanced commands for branching, merging, and conflict resolution.",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCJagPgXGQPSYez1Q_8qm-hxRMwpKH6v_thnVVp5g4BjOtXzugvsoVNHlJnD-m0ry2i8BvK_SMXHoXjMytcalFsBbwWXfkkdD-c3Ywkk-SaHYIe-ZOZ6YElyo9muzU3_Is7qK9fGIEjJXOMgn5Xb13YWMm8IzRYURpyiWro9DTAK9MWzQt65yRk79xM1o1hilW8hrPRYoVAF4FwpnGS2DzvtOl_Sc8BSE5aRkdBkwcgvBrHsXpnwPU8IrrnQI4FLbAte1OmFuIK6H7",
  },
];

export const TAB_CATEGORIES = ["All", "Frameworks", "Languages", "Tools"];

export const FULL_TIP_CONTENT = {
  "React Best Practices": {
    title: "React Best Practices",
    desc: `# React Performance Optimization Tips

React applications can become slow as they grow. Here are some best practices to keep your apps fast and responsive:

## 1. Use React.memo for Component Memoization

When a component receives the same props but re-renders due to parent updates, wrap it in React.memo:

\`\`\`jsx
const MyComponent = React.memo(function MyComponent(props) {
  // your component logic
  return <div>{props.name}</div>;
});
\`\`\`

## 2. Optimize useEffect Dependencies

Always provide a dependency array to useEffect and ensure it contains only the variables that should trigger the effect:

\`\`\`jsx
useEffect(() => {
  // Effect code
  document.title = \`Hello, \${name}\`;
}, [name]); // Only re-run if name changes
\`\`\`

## 3. Use Lazy Loading and Code Splitting

For larger applications, split your code and lazy load components:

\`\`\`jsx
const ExpensiveComponent = React.lazy(() => import('./ExpensiveComponent'));

function App() {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <ExpensiveComponent />
    </React.Suspense>
  );
}
\`\`\`

## 4. Implement Virtual Lists for Large Datasets

When rendering long lists, use a virtualization library like react-window to render only visible items:

\`\`\`jsx
import { FixedSizeList } from 'react-window';

function ListComponent({ items }) {
  const renderRow = ({ index, style }) => (
    <div style={style}>
      {items[index].name}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width={300}
      itemSize={50}
      itemCount={items.length}
    >
      {renderRow}
    </FixedSizeList>
  );
}
\`\`\`

Remember, premature optimization can make your code harder to read. Optimize only when necessary!`
  },
  "Python Efficiency Tips": {
    title: "Python Efficiency Tips",
    desc: `# Writing Efficient Python Code

Python is known for its readability, but can sometimes be slow. Here are some techniques to write faster Python code:

## 1. Use List Comprehensions

List comprehensions are faster than traditional for loops:

\`\`\`python
# Instead of:
result = []
for i in range(1000):
    if i % 2 == 0:
        result.append(i * i)

# Use:
result = [i * i for i in range(1000) if i % 2 == 0]
\`\`\`

## 2. Leverage Built-in Functions

Built-in functions like map, filter, and reduce are optimized:

\`\`\`python
# Instead of:
result = []
for item in data:
    result.append(transform(item))

# Use:
result = list(map(transform, data))
\`\`\`

## 3. Use Sets for Membership Testing

Sets provide O(1) membership testing:

\`\`\`python
# Instead of:
if item in large_list: # O(n)
    do_something()

# Use:
if item in large_set: # O(1)
    do_something()
\`\`\`

## 4. Prefer 'join' for String Concatenation

Using join is much faster than += for building strings:

\`\`\`python
# Instead of:
result = ""
for i in range(1000):
    result += str(i)

# Use:
result = "".join(str(i) for i in range(1000))
\`\`\`

## 5. Use NumPy for Numerical Operations

For numerical work, NumPy operations are much faster than Python loops:

\`\`\`python
import numpy as np

# Instead of:
result = [x * 2 for x in data]

# Use:
result = np.array(data) * 2
\`\`\`

Remember: "Premature optimization is the root of all evil." Profile your code first to identify actual bottlenecks!`
  },
  "Git Advanced Commands": {
    title: "Git Advanced Commands",
    desc: `# Advanced Git Commands and Techniques

Beyond the basic git workflow, these advanced commands will help you manage complex scenarios:

## Interactive Rebase

Rewrite, reorganize, and clean up your commit history:

\`\`\`bash
# Rewrite the last 3 commits
git rebase -i HEAD~3
\`\`\`

## Cherry-Pick

Apply specific commits from one branch to another:

\`\`\`bash
# Apply commit abc123 to current branch
git cherry-pick abc123
\`\`\`

## Reflog - Your Safety Net

Recover from mistakes by accessing previous states:

\`\`\`bash
# View reflog history
git reflog

# Restore to a previous state
git reset --hard HEAD@{2}
\`\`\`

## Bisect - Find Bugs

Binary search through commits to find what introduced a bug:

\`\`\`bash
# Start the process
git bisect start

# Mark the current version as bad
git bisect bad

# Mark a known good commit
git bisect good abc123

# Git will checkout commits for you to test
# After testing, mark each as good or bad
git bisect good  # or git bisect bad

# When finished
git bisect reset
\`\`\`

## Worktree - Multiple Working Directories

Work on multiple branches simultaneously:

\`\`\`bash
# Create a new working directory for feature branch
git worktree add ../project-feature feature-branch

# Remove when done
git worktree remove ../project-feature
\`\`\`

## Advanced Diff and Log

Get more insightful history views:

\`\`\`bash
# Show changes with context
git log -p

# Show a graph of branches
git log --graph --oneline --all

# Word-level diff instead of line-level
git diff --word-diff
\`\`\`

## Stashing with Options

Save work-in-progress with more control:

\`\`\`bash
# Stash including untracked files
git stash -u

# Stash with a message
git stash save "WIP: feature X implementation"

# Apply a specific stash
git stash apply stash@{2}
\`\`\`

These advanced Git techniques can significantly improve your workflow efficiency!`
  }
};

export const RELATED_TECH = {
  "React Best Practices": {
    name: "React.js",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB752F83TIMX8MYOc4bh2eW0P0HyhZl17Tf87iL3a24MpknuNqbbeWWEWhb3RlHxfXqGLT1tYkpj2_Fv9VWfjaFKidENDmZEHsCrqoQKv7P6oEVZqAm0xvZDL2_JkANCjEzJylEQXLIucVDTl0-iRlRHk59l5JQm42NYrT_saq--14GDZIiF3lbwGXfb2svF4MIa29Yxwe69wKojtqQWOF2hZpJkqYjohFtfLHI4hN5uRILAbt6_uV1UpUCOR1ArS_cBS4ca0fqMcZY",
    category: "Frontend"
  },
  "Python Efficiency Tips": {
    name: "Python",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuC9aljv3M9e2kZDkPpnfSOFdFCBlNoFjs8ZVE9ZIK0n6fR-W7_ZNEEgOJZQ1M1theTpcAPuuQeInlsNB-5TT3ofvW4IvvmRy0iBfyBpMmWWIoaZcSg0g5wBHjujR5Du_XjDdsyZ50fKHUhFjwJEFVrnhJw_kIlEx9OgTDPri4wQnDX76dbcFXPp-GfHLq7KQUZquS-QkDUPQ1gKZ7XqSICV_4nKFXDeHyO6iA9hQlKQV6BfeCmVmQuh30Q0YWeb8USBqEm-sFTjPKo5",
    category: "Backend"
  },
  "Git Advanced Commands": {
    name: "Git",
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDCJagPgXGQPSYez1Q_8qm-hxRMwpKH6v_thnVVp5g4BjOtXzugvsoVNHlJnD-m0ry2i8BvK_SMXHoXjMytcalFsBbwWXfkkdD-c3Ywkk-SaHYIe-ZOZ6YElyo9muzU3_Is7qK9fGIEjJXOMgn5Xb13YWMm8IzRYURpyiWro9DTAK9MWzQt65yRk79xM1o1hilW8hrPRYoVAF4FwpnGS2DzvtOl_Sc8BSE5aRkdBkwcgvBrHsXpnwPU8IrrnQI4FLbAte1OmFuIK6H7",
    category: "DevOps"
  }
};
