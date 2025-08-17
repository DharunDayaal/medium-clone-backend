# Medium Backend Clone

This project is a backend clone of **Medium** built with **Node.js, Express, and MongoDB (Mongoose)**.  
It provides APIs for authentication, posts, tags, comments, likes, and follows.

---

## 🚀 Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: JWT & Sessions
- **Authorization Middleware**: Role/User-based

---

## 📂 Schemas Overview

### 📝 Post Schema
| Attribute      | Type                  | Required | Relation                   |
|----------------|-----------------------|----------|----------------------------|
| author         | ObjectId              | ✅        | Ref → User                 |
| title          | String                | ✅        |                            |
| slug           | String (unique)       | ✅        |                            |
| oldSlugs       | [String]              | ❌        |                            |
| content        | String                | ✅        |                            |
| tags           | [ObjectId]            | ❌        | Ref → Tag                  |
| likesCount     | Number                | ❌        |                            |
| commentsCount  | Number                | ❌        |                            |
| readTime       | Number                | ❌        |                            |
| status         | Enum(draft, published)| ❌        |                            |
| publishedAt    | Date                  | ❌        |                            |

---

### 👤 User Schema
| Attribute      | Type     | Required | Relation |
|----------------|----------|----------|----------|
| name           | String   | ✅        |          |
| email          | String   | ✅ (unique) |          |
| password       | String   | ✅        |          |
| bio            | String   | ❌        |          |
| profileImage   | String   | ❌        |          |
| socialLinks    | Object   | ❌        | (website, twitter, github, linkedin) |
| followersCount | Number   | ❌        |          |
| followingCount | Number   | ❌        |          |

---

### 💬 Comment Schema
| Attribute       | Type       | Required | Relation      |
|-----------------|------------|----------|---------------|
| post            | ObjectId   | ✅        | Ref → Post    |
| author          | ObjectId   | ✅        | Ref → User    |
| content         | String     | ✅        |               |
| likesCount      | Number     | ❌        |               |
| parentCommentId | ObjectId   | ❌        | Ref → Comment |

---

### 🏷️ Tag Schema
| Attribute   | Type     | Required | Relation |
|-------------|----------|----------|----------|
| name        | String   | ✅ (unique) |          |
| description | String   | ❌        |          |
| postsCount  | Number   | ❌        |          |

---

### ❤️ Like Schema
| Attribute | Type     | Required | Relation        |
|-----------|----------|----------|-----------------|
| user      | ObjectId | ✅        | Ref → User      |
| post      | ObjectId | ❌        | Ref → Post      |
| comment   | ObjectId | ❌        | Ref → Comment   |

---

### 🔗 Follow Schema
| Attribute | Type     | Required | Relation  |
|-----------|----------|----------|-----------|
| follower  | ObjectId | ✅        | Ref → User |
| following | ObjectId | ✅        | Ref → User |

---

### 🔐 Session Schema
| Attribute | Type     | Required | Relation  |
|-----------|----------|----------|-----------|
| user      | ObjectId | ✅        | Ref → User |
| token     | String   | ✅        |           |
| expiresAt | Date     | ❌        |           |

---

## 📡 API Endpoints

### 🔑 Auth Routes
| Method | Endpoint            | Description              |
|--------|---------------------|--------------------------|
| POST   | `/api/v1/auth/sign-up`   | Register a new user     |
| POST   | `/api/v1/auth/sign-in`   | Login a user & get token|
| POST   | `/api/v1/auth/sign-out`  | Logout user             |

---

### 📝 Post Routes
| Method | Endpoint                  | Description                  |
|--------|---------------------------|------------------------------|
| GET    | `/api/v1/post/`           | Get all posts                |
| POST   | `/api/v1/post/create`     | Create a new post            |
| PUT    | `/api/v1/post/publish/:id`| Publish a draft post         |
| PUT    | `/api/v1/post/unpublish/:id`| Unpublish a post           |
| PUT    | `/api/v1/post/update/:id` | Update a post                |
| GET    | `/api/v1/post/:id`        | Get post by ID               |
| DELETE | `/api/v1/post/delete/:id` | Delete a post                |
| POST   | `/api/v1/post/:id/like`   | Like/Unlike a post           |
| GET    | `/api/v1/post/tag/:tagName`| Get posts by tag            |
| GET    | `/api/v1/post/user/:id`   | Get all posts by a user      |

---

### 💬 Comment Routes
| Method | Endpoint                               | Description                    |
|--------|----------------------------------------|--------------------------------|
| GET    | `/api/v1/comment/:postId`              | Get all comments for a post    |
| POST   | `/api/v1/comment/create/:postId`       | Create a comment on a post     |
| POST   | `/api/v1/comment/create/:commentId/replies` | Create a reply to a comment |
| PUT    | `/api/v1/comment/update/:commentId`    | Update a comment/reply         |
| PUT    | `/api/v1/comment/like/:commentId`      | Like/Unlike a comment          |
| DELETE | `/api/v1/comment/delete/:commentId`    | Delete a comment or reply      |

---

### 🔗 Follow Routes
| Method | Endpoint                  | Description                     |
|--------|---------------------------|---------------------------------|
| POST   | `/api/v1/follow/:id`      | Follow a user (id = userB)      |
| DELETE | `/api/v1/follow/:id`      | Unfollow a user (id = userB)    |
| GET    | `/api/v1/follow/following/:id` | Get all users a user follows |
| GET    | `/api/v1/follow/followers/:id` | Get all followers of a user  |

---

### 🏷️ Tag Routes
| Method | Endpoint               | Description            |
|--------|------------------------|------------------------|
| GET    | `/api/v1/tag/`         | Get all tags           |
| POST   | `/api/v1/tag/create`   | Create a new tag       |

---

### 👤 User Routes (🚧 In Development)
- User profile
- User update
- User activity

---

## 📌 Notes
- Authentication is required for most routes (middleware: `authorize`).
- User routes are still in development.
- Schema relations are managed using **Mongoose population**.

---

## 🛠️ Future Improvements
- Full-text search for posts
- Notifications system
- Draft autosave
- Rich text editor integration
