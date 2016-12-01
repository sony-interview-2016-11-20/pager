# Sony Interview Question - Search Twitch.tv


## Works for me under:
* Microsoft Edge: 38 (Windows)
* Firefox: 50 (Windows)
* Chrome: 54 (Windows)

## Comments

As I said during the interview, I am very out of date with my active javascript use.

I basically just took the latest EcmaScript standard, and per-feature browser compatibility and went from there.

**Goal:** To create the application with minimal to no dependencies between components
Desgin Decisions:
* Event Based application design using a declarative (vs imperative) use-case implementation strategy
* Work around limitations in JS event model not having defined priorities **



The following observations are to be noted:
* Unfamiliarity with industry formatting guidelines, used IDE defaults
 * One stylistic choice was the use of strings for object keys rather than tokens
 
* Unfamiliarity with industry norms for non framework code (if any exist)
 * Designed using best practises from PHP and Windows UI driven applications
 * This made the code isolated, and coded primarily using an Event Use Case model

## Application Stream

### Application Configuration:
* Event application.bootstrap
* Event application.init

### Application Use Cases (Event: Action)
* search: Execute Search
* search-data-load-error: Display error message
* search-data-load: Update pager state to reflect new result set
* search-data-load: Generate normalized search result object
* search.page-next: Execute Search for next page
* search.page-prev: Execute Search for prev page

### View Use Cases
#### Search Box
* submit: emit search

#### Message Box
* search-data-load-error: Update error message text
* search-data-load: hide error message text
* search-data-load: render result set

#### Result Total
* search-data-load: update result total counter

#### Pager Elements (Top)
* search.page-change: Update Pager Display Text
* search.page-change: Update Pager Control Display (class .disabled)


## Supporting Code
### serviceContainer
Simple service container implementation to support a dependency injection design.

This makes decoupling all the objects easy.
Provides custom factories to ensure all objects can be wired independently, and changed globally with ease.

### cssAccessor
Thought I was going to do more UI work, so this utility interface did not get built out.

### jsonCallbackManager
Class to abstract out the creation and cleanup of script tags, and a global callback for jsonP calls.

This class is consumed by the twitchDataProvider

### simplePager
Simple pager manager, to remove any pager functionality from the view or application.
It holds the computed state of the current pager (page, limit, searchQuery)

This class binds to passed in elements (prevButton, nextButton) click event, and will generate navigation events.

Events Generated:
* {namespace}.page-next
* {namespace}.page-prev
* {namespace}.page-change


### twitchDataProvider
Class to realise the dataProvider interface. ( search(query, page); )

This class requires a jsonCallbackManager to handle the intricacies of jsonP code, that is superficial to the business logic of this class.

TODO: Relocate code for script element insertion / deletion to the jsonpCallbackManager as it's not in the data-provider domain.

### applicationAutoload
The core application definition.
