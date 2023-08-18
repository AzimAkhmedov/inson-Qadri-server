# Inson Qadirlari Server

## Installation

```sh
  cd server
```

```sh
  npm install
```

## How to run

```sh
  npm run dev
```

> Note: Project will run at `http://localhost:5000/`

## Events

`http://localhost:5000/events/`

## Usage

### Get All Events

<p>Get Request</p>

```sh
url/events/
```

### Get Current Event (Single)

<p>Get Request</p>

```sh
url/events/:id
```
Example:
<p>url/events/1</p>

### Create Event

<p>Post Request</p>

```sh
url/events/
```

> Note: Request must be FormData, and objects and arrays must be converted by JSON.stringify()

Request body must be:
<br/>
title: string,
<br/>
img?: Object
<br/>
description: {
<br/>
text: string,
<br/>
time: string,
<br/>
date: string,
<br/>
location: string,
<br/>
},
<br/>
needs: string[]
<br/>
contact: string
