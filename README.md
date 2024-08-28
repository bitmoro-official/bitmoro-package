# Bitmoro Messaging and OTP Library [![NPM version](https://img.shields.io/npm/v/bitmoro.svg)](https://npmjs.org/package/bitmoro) ![npm bundle size](https://img.shields.io/bundlephobia/minzip/bitmoro)

This library provides a convenient interface for sending messages and handling OTP (One-Time Password) operations using the Bitmoro API from TypeScript or JavaScript.

## Installation

```sh
npm install bitmoro

```

## Usage

The code below shows how to get started using the messaging and OTP features.

### Sending Messages

```js
import { MessageSender } from 'bitmoro';

const token = process.env['BITMORO_API_TOKEN'];
const sender = new MessageSender(token);

async function sendMessage() {
    try {
        const success = await sender.sendSms('Hello, World!', ['+1234567890'], 'YourSenderId');
        console.log('Message sent:', success);
    } catch (error) {
        console.error('Error sending message:', error);
    }
}

sendMessage();

```

### Handling OTPs

```js
import { OtpHandler } from 'bitmoro';

const token = process.env['BITMORO_API_TOKEN'];
const otpHandler = new OtpHandler(token);

async function sendOtp() {
    try {
        const otp = await otpHandler.registerOtp('user-id');
        console.log('OTP registered:', otp);
    } catch (error) {
        console.error('Error registering OTP:', error);
    }
}

async function verifyOtp() {
    try {
        const isValid = otpHandler.verifyOtp('user-id', '123456');
        console.log('OTP valid:', isValid);
    } catch (error) {
        console.error('Error verifying OTP:', error);
    }
}

sendOtp();
verifyOtp();

```

## Features

- **Send Messages**: Easily send SMS messages to multiple recipients using a straightforward API.
- **OTP Generation and Verification**: Generate secure OTPs and verify them for authentication purposes.
- **Error Handling**: Includes custom error classes to handle API errors effectively.

### Streaming Responses

The library supports streaming responses for real-time applications. This can be particularly useful for use cases where immediate feedback is required.

### Request & Response Types

The library includes TypeScript definitions for all request parameters and response fields, ensuring type safety and better developer experience.

### Automated Function Calls

Automate repetitive tasks by integrating function calls within your message handling and OTP verification processes.

### Bulk Operations

For applications requiring bulk message sending or OTP generation, the library provides helper functions to streamline these operations.

## Error Handling

When the library is unable to connect to the API, or if the API returns a non-success status code, a `MessageSenderError` will be thrown. Here’s an example of how to handle such errors:

```js
async function main() {
  try {
    await sender.sendSms('Hello, World!', ['+1234567890']);
  } catch (err) {
    if (err instanceof MessageSenderError) {
      console.log(err.message); // Error message
    } else {
      throw err;
    }
  }
}

main();

```


### Key Sections Explained:

- **Installation**: Provides a command for installing the library via npm.
- **Usage**: Offers examples demonstrating how to use the `MessageSender` and `OtpHandler` classes for sending messages and handling OTPs.
- **Features**: Lists the main features of the library, including messaging, OTP handling, streaming responses, and more.
- **Error Handling**: Describes how errors are managed and provides example code for handling API errors.
- **Contributing**: Encourages contributions and links to the guidelines.
- **License**: Provides information about the project's license.

This format ensures that users have a comprehensive understanding of the library's capabilities and how to effectively use it in their projects. Adjust the content as necessary to fit additional features or specific documentation needs.

