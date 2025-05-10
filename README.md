# 🎬Movie Search Web App

## 📊 Overview

This web application allows users to search for movies by title, view detailed information such as IMDb ratings, plot summaries, genres, and cast, and manage a personalized watchlist. The app also supports theme toggling (light/dark mode) and is fully responsive across devices.

## 🔧 Implementation

The app uses the **OMDb API** to fetch movie details based on user searches. It supports movie search functionality and stores data locally in the browser using **localStorage** for watchlist persistence and theme preferences. The user interface is designed using **HTML**, **CSS**, and **Bootstrap**, with features like sorting the watchlist based on IMDb ratings and toggling between light and dark modes.

## 🚀 Features

- **Movie Search**:  
  Users can search for movies by title, and the app fetches detailed information, including IMDb ratings, plot summaries, genres, and cast, from the **OMDb API**.

- **Watchlist Management**:  
  Users can add or remove movies to/from their watchlist. The watchlist is stored in **localStorage**, ensuring persistence even after page reloads, so users can continue where they left off.

- **Dark/Light Mode**:  
  The app supports a toggle between light and dark themes. Users' theme preferences are saved in **localStorage** and automatically applied on subsequent visits, offering a personalized experience.

- **Responsive Design**:  
  The application is designed to provide a smooth and intuitive user experience across various devices (desktop, tablet, and mobile), ensuring the interface adjusts appropriately to different screen sizes.

- **Movie Sorting**:  
  Users can sort the movies in their watchlist based on IMDb ratings in either ascending or descending order, helping them prioritize movies they want to watch.

- **Fast Load Time**:  
  The app is optimized for speed, offering quick search results with minimal loading time.

- **Watchlist Persistence**:  
  Added movies remain in the watchlist across sessions, ensuring users do not lose their saved list upon refreshing or reopening the page.

- **Theme Preference**:  
  The app remembers and applies users' theme preferences (light/dark mode) automatically upon page reloads, providing a consistent experience.

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Bootstrap
- **API**: OMDb API for movie data
- **Storage**: localStorage for saving watchlist and theme preferences
