# Design Patterns Course Media

Place your course media files in this directory with the following structure:

## Required Files

### Course Thumbnail
- `thumbnail.jpg` - Course thumbnail image (recommended: 1280x720px)

### Module 1: Introduction to Design Patterns
- `intro-what-are-patterns.mp4` - What are Design Patterns?
- `intro-history.mp4` - History and Gang of Four
- `intro-categories.mp4` - Categories of Patterns

### Module 2: Creational Patterns
- `creational-singleton.mp4` - Singleton Pattern
- `creational-factory.mp4` - Factory Method Pattern
- `creational-abstract-factory.mp4` - Abstract Factory Pattern
- `creational-builder.mp4` - Builder Pattern
- `creational-prototype.mp4` - Prototype Pattern

### Module 3: Structural Patterns
- `structural-adapter.mp4` - Adapter Pattern
- `structural-decorator.mp4` - Decorator Pattern
- `structural-facade.mp4` - Facade Pattern
- `structural-proxy.mp4` - Proxy Pattern

### Module 4: Behavioral Patterns
- `behavioral-observer.mp4` - Observer Pattern
- `behavioral-strategy.mp4` - Strategy Pattern
- `behavioral-command.mp4` - Command Pattern
- `behavioral-state.mp4` - State Pattern

## Running the Seed Script

Once you've added your media files:

```bash
cd backend
bun run ts-node src/seedDesignPatterns.ts
```

## Notes

- Videos will be uploaded to Cloudinary folder: `e-learning/videos/design-patterns`
- Thumbnail will be uploaded to: `e-learning/courses`
- First 2 lessons are marked as FREE preview
- Missing files will be skipped with a warning
- The script will create or update the course if it already exists
