
# Infinite Journal Timeline


This project's core focus was to create an exceptionally smooth and responsive user experience, ensuring continuous scrolling through months and years without any lag or jitter. Every component, from the custom-built grid to the swipeable card viewer, was designed with performance and mobile-first principles in mind.

### Live Demo


---

## Core Features

#### A Truly Infinite Experience
-   **Journey Through Time:** Seamlessly journey through past and future months with a truly infinite vertical scroll.
-   **Silky-Smooth Performance:** A virtualized list renders only the visible weeks, guaranteeing a fluid, lag-free experience even with thousands of entries.
-   **Optimized Assets:** All images are optimized and served locally to eliminate network lag, with key images preloaded for an instant-on feel.

#### Intuitive & Dynamic UI
-   **Accurate Header Updates:** The header intelligently and correctly updates in real-time to reflect the month that is most visible in the viewport.
-   **Custom-Built Grid:** The calendar grid is custom-built, providing full control over the layout, styling, and functionality.
-   **Fully Responsive:** A mobile-first design ensures a beautiful and functional experience on any device, from phones to desktops.

#### Memory-Focused Functionality
-   **Full Journal Management:** Add new memories on any date, edit existing descriptions or details, and delete entries seamlessly.
-   **Swipeable Card Viewer:** Tap an entry to open a beautiful, swipeable card carousel, perfect for browsing memories on touch devices. The desktop view expands into a "cover flow" effect.

#### Quality of Life Features
-   **Keyboard Navigation:** Navigate between months quickly using the left and right arrow keys.
-   **Powerful Filtering:** A collapsible header panel allows you to instantly filter entries by category or search by text in their description.

---

## Tech Stack

-   **Framework:** [React](https://reactjs.org/) (with Create React App)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Virtualization:** [React Virtuoso](https://virtuoso.dev/) for high-performance scrolling.
-   **Date Management:** [date-fns](https://date-fns.org/)
-   **Icons:** [Lucide React](https://lucide.dev/)

---

## Getting Started

Follow these instructions to run the project on your local machine.

### Prerequisites

You need to have [Node.js](https://nodejs.org/) (v16 or later) and [npm](https://www.npmjs.com/) installed.

### Installation & Running

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/your-repo-name.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd your-repo-name
    ```
3.  **Install the dependencies:**
    ```bash
    npm install
    ```
4.  **Start the development server:**
    ```bash
    npm start
    ```

The application will now be running and accessible at **[http://localhost:3000](http://localhost:3000)**.

---

## Developer's Notes

This section details some of the key technical decisions and challenges during development.

### 1. Tackling the Infinite Scroll

The primary challenge was rendering a seemingly infinite number of calendar weeks without crashing the browser. A naive approach of rendering thousands of DOM nodes is not feasible.

-   **Solution: Virtualization.** I chose the **`react-virtuoso`** library to solve this. It is a powerful list virtualization engine that only renders the handful of week rows currently visible in the viewport. As the user scrolls, it efficiently recycles DOM nodes to display new content, keeping memory usage low and the UI incredibly smooth.

-   **Achieving Bi-Directional Scrolling:** To allow scrolling into both the past and future, I used a "start in the middle" approach. A large `totalCount` of weeks is provided to the virtual list, and the view is programmatically scrolled to the middle index on load. This index represents "today," allowing the user to scroll up into the past or down into the future.

### 2. State and Entry Management

For global state—including all journal entries, search queries, and active filters—I opted for React's built-in Context API (`JournalProvider`). This context handles all CRUD operations (add, edit, delete) and persists the state to `localStorage`, providing a clean way to share data and actions throughout the component tree without prop-drilling.

### 3. Challenges & Lessons Learned

The initial implementation of the dynamic month header used a simple `onScroll` event listener. While functional on desktop, it produced noticeable "jank" (lag) on mobile devices during fast scrolling. This led me to refactor the logic using the **`IntersectionObserver` API**, which was a great learning experience. It proved to be far more performant and reliable for determining which month was most visible in the viewport, resulting in the smooth header updates you see now.

### 4. Future Improvements

-   **Backend Integration:** The journal entries are currently stored in `localStorage`. The next logical step would be to connect this to a proper backend service and database to allow for user accounts and data persistence across devices.
-   **Animations & Transitions:** I would add subtle animations for the header transitions and modal pop-ups using a library like `framer-motion` to further enhance the user experience.
