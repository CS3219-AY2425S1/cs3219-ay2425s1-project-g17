[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/bzPrOe11)
# CS3219 Project (PeerPrep) - AY2425S1
## Group: G17

PeerPrep is a web application designed to support collaborative coding and practice sessions. This project uses a microservices architecture and a component-based frontend design to offer a smooth and scalable user experience for peer-to-peer learning. The application is built with a modern tech stack including React, TypeScript, Express, MongoDB, and AWS, and utilises Docker and GitHub Actions for deployment and CI/CD automation.

## Contributors
- [@carlintyj](https://github.com/Carlintyj)
- [@jonyxzx](https://github.com/Jonyxzx)
- [@shuyangk](https://github.com/shuyangk)
- [@dom-buri](https://github.com/dom-buri)
- [@NgYaoDong](https://github.com/NgYaoDong)

## Features
- User Authentication: Login and registration functionality with protected routes for authenticated users.
- Question Repository: A searchable and filterable collection of coding questions.
- Collaboration Workspace: Real-time coding, chat, and code execution interface powered by Judge0 API for code execution.
- Progress Tracking: Dashboard and Profile Page to monitor user progress and settings.
- Scalable Architecture: Microservices structure that allows independent scaling of core services.

## Tech Stack
- Frontend: React with TypeScript, Material-UI for UI components.
- Backend: Node.js with Express, MongoDB, and Redis.
- Authentication: Managed with context provider pattern for global state management.
- Deployment: Dockerized services deployed on AWS ECS.
- Continuous Integration: GitHub Actions for automated testing and deployment.

## Architecture
The architecture follows a Component-Based Design for the frontend and a microservices approach for backend services, making each feature modular and independently manageable.

### Key Components:
- Public Routes: Accessible to users before login (Landing Page, Login, Registration).
- Authenticated Routes: Available only after login (Dashboard, Collaboration Workspace, Profile Page).
- AuthContext: Global context provider for managing authentication state across components.
- Microservices: Independent services for user management, question repository, and collaboration tools.

## Screenshots of PeerPrep:
<img width="1433" alt="Screenshot 2024-11-07 at 8 21 20 PM" src="https://github.com/user-attachments/assets/dac694b4-5678-4260-aa96-cc6be1b92898">
<img width="1433" alt="Screenshot 2024-11-07 at 8 22 45 PM" src="https://github.com/user-attachments/assets/ecc19c55-be7c-40ef-8c42-09e2dce58e24">
<img width="1436" alt="Screenshot 2024-11-07 at 8 52 35 PM" src="https://github.com/user-attachments/assets/354c14ea-6d7c-42d5-9567-0babbc4e8982">
<img width="1437" alt="Screenshot 2024-11-07 at 8 54 41 PM" src="https://github.com/user-attachments/assets/16fa7bc5-52cd-400f-b679-116e5fd3cf3d">
