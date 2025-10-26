BelTV – TV Show Browser App

BelTV is a modern web application built using HTML, Bootstrap, and vanilla JavaScript. It allows users to browse, search, and explore information about TV shows using live data from the TVMaze API.

**** Features Overview

📄 Search & Navigation:

-Search bar with live query support

-Auto-validation with Bootstrap 5

-Navigable results from URL parameters

📄 Show Gallery (index.html):

-Responsive Bootstrap card layout

-20 shows per page with pagination

-Sort by: Rating, Name, Recency

-Filter by:

    .Status

    .Type

    .Genre

    .Language

    .Country

    .Network / Web Channel

    .Runtime

    .Rating

    .Like/Unlike toggle using emoji (🤍 / ❤️)

📄 Show Details (showInfo.html)

-Tab layout: Episodes, Cast, Seasons

-Summary rendered as HTML

-Responsive layout with Bootstrap grid

-Dynamic follow button toggle (🤍 Follow / ❤️ Following)

-Show metadata: Type, Language, Runtime, Official Site

📄 Schedule Viewer (schedule.html)

-Filter schedule by Date, Country, Genre

-Table with 30-minute time slots, scrollable with arrows

-Dynamic header generation for time periods

-Shows grouped by channel

-Clickable show titles linking to details


How to Test the App
-----------------------

****Test Scenarios

--Search:

Enter a valid TV show name in the search bar

Submit and confirm relevant results appear

Like/Unlike

Click the heart button under any show

It should toggle between 🤍 and ❤️

--Filters & Sorting:

Use dropdowns to filter shows by genre, type, language, etc.

Use the sort dropdown to reorder by rating or name

--Pagination:

Use next/previous buttons to navigate through show pages

--Show Details Page

Click a show card

Confirm the page loads with Summary, Episodes, Cast, and Seasons tabs

--Schedule Page

Go to schedule.html

Adjust the date, country, genre

Scroll through time slots using arrows