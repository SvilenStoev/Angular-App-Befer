## &copy; Befer - Logo
![BoostUp Logo 4](https://www.linkpicture.com/q/Logo21.png)

## Hosted on:

**Heroku -** https://befer.herokuapp.com/

## :eyeglasses: Project Introduction

**Befer Website** is created as defense project for **Angular** course at [SoftUni](https://softuni.bg/ "SoftUni") (March 2022).

Befer website is a network for people who would like to share their "before and after" photography to other, or just store them without expose in public. Place for look at other people photography and have fun.
Befer is a platform, where users can introduce their best pictures and great transformations or comment and like other people photos.

## :pencil2: Overview

**Befer** is a place, where users can share their own "before and after" photography, or their opinion of other's pictures. They can achive this through creating posts and adding comments. All users can browse through all public posts.

## :pencil: Project Description

### 1. Users

**Befer** supports users with profile page, storing basic information about them like: full name, username, email, default profile picture. Every user have own posts page, where he can store his public or private posts. Users are able to add comments to every posts and like, or disslike posts of other users. Every user have access to all public posts, which can be sorted by date ot likes. Only authenticated users can see full features of the application.

### 2. Posts

All authenticated users are able to add posts. For this purpose they should fill a form with basic details for their post (title, "Before" image URL, "After" image URL, optionaly: description and to chose whether their post will be public or private).
> :warning: **Note**: Once successfully added a private post, it is visible only in "My Posts" page and it is not visible to other users.

If the post is public It is shown in all posts page and home page (only if the post entered top 10 posts by creation date or likes).
All posts can be accessing using "All posts" button in the navbar, where there is a option for sorting them by likes or creation date. Top 5 or top 10 posts can be seen on home page with option for sorting them by likes or creation date.
Post details button is provided in every company form as "see After".
Using post details page, an user can add a comment to the post, like or dislike the post.
Author of a particular post can see delete and edit buttons in details page of his posts, from where he can access edit post page, or delete the post.

### 3. Comments, Likes, Dislikes

Comments can be posted only by authorized users to all public posts. Every single comment is connected to a single post.
Only author of the comment have the option to delete it.
Only users, which are not author of a single post can like it. After that they are able to dislike the post.

## :hammer: Built With
- [Angular](https://github.com/angular)
- Angular validations with reactive forms and ngForm
- Angular features for components, router, httpRequest, etc.
- [Font Awesome](https://fontawesome.com/)
- JavaScript
- [TypeScript](https://www.typescriptlang.org/)
- [Back4app](https://www.back4app.com/) as a backend
- Custom HTML & CSS
- Web Api services + AJAX real-time Requests

## Initial StartUp
Run ng serve for a dev server. Navigate to http://localhost:4200/.

## 🧑 Author

[Svilen Stoev](https://github.com/SvilenStoev)
- Facebook: [@Svilen Stoev](https://www.facebook.com/svilen.stoev.3)
- LinkedIn: [@svilenstoev](https://www.linkedin.com/in/svilenstoev/?fbclid=IwAR3__rQn3sR4rxJKEL6FK4QV1aR9tnF6vnOwMWsBghXz3xZPx-lYOc66gtU)

## :v: Your opition is important for me

Give a :star: if you like this project!

## 💵 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
