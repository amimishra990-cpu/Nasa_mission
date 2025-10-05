# Render Deployment Instructions for NASA Exoplanet App

Your project is now ready for deployment. Follow these steps to deploy your application to Render.

## Step 1: Push Your Code to a Git Repository

Render deploys code from a Git repository (like GitHub, GitLab, or Bitbucket). If you haven't already, you need to push your project to one of these services.

1.  **Initialize Git** (if you haven't already):
    ```bash
    git init
    git branch -M main
    ```

2.  **Add and commit your files**:
    ```bash
    git add .
    git commit -m "Prepare for Render deployment"
    ```

3.  **Add a remote repository and push your code**:
    Replace `<your-repo-url>` with the URL of your repository.
    ```bash
    git remote add origin <your-repo-url>
    git push -u origin main
    ```

## Step 2: Deploy on Render using the Blueprint

Your project contains a `render.yaml` file, which tells Render how to build and deploy your services. This is called a "Blueprint".

1.  Go to the **[Render Dashboard](https://dashboard.render.com)**.
2.  Click the **New +** button and select **Blueprint**.
3.  Connect the Git repository you just pushed your code to.
4.  Render will automatically detect the `render.yaml` file in your repository and show the two services to be created: `nasa-exoplanet-api` and `nasa-exoplanet-frontend`.
5.  Click **Apply** to create and deploy the services.

## Step 3: Verify Deployment

Render will start building and deploying both your backend and frontend. This may take a few minutes.

-   You can monitor the deployment progress in the logs for each service.
-   Once the deployment is complete, your frontend will be live at the URL provided for the `nasa-exoplanet-frontend` service (e.g., `https://nasa-exoplanet-frontend.onrender.com`).
-   The backend API will be available at its own URL (e.g., `https://nasa-exoplanet-api.onrender.com`), but you will interact with it through the frontend.

Your application is now deployed and live on the web!
