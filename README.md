# Email Tracking Pixel Server

This Node.js server provides a tracking pixel that can be embedded in emails to track when the recipient opens the email. The server logs user information, including the user's name and email, to a MongoDB database.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB installed and running

### Installation

1. Clone this repository:

    ```bash
    git clone https://github.com/itsnischayyy/trackingPixel.git
    cd trackingPixel
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

3. Start the server:

    ```bash
    node .\index.js
    ```

    The server will run at `http://localhost:3000`.

## Usage

1. Embed the tracking pixel in your email by including the following HTML:

    ```html
    <img src="http://localhost:3000/tracking-pixel?name=RecipientName&email=recipient@email.com" width="1" height="1" alt="Tracking Pixel">
    ```

    Replace `RecipientName` and `recipient@email.com` with the actual name and email address of the email recipient.

2. When the recipient opens the email, a request will be made to the server, and the user's information will be stored in the MongoDB database.

## Notes

- This is a basic implementation, and in a production environment, you should secure the server, handle errors, and use a more robust database solution.
- Make sure to replace the MongoDB connection URL in server.js with your actual connection string.


