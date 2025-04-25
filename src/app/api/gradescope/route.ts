import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  return NextResponse.json(
    {
      status: "success",
      data: [
        {
          "course": "Computer Architecture I",
          "due": 1740499140000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1740499140
            ],
            "lateStatus": null,
            "releaseDate": "2025-02-18 12:00:00 +0800",
            "remaining": null,
            "status": "1.0 / 1.0",
            "title": "Homework 1",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "1.0 / 1.0",
          "submitted": true,
          "title": "Homework 1",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1742227140000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1742227140
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-01 20:00:00 +0800",
            "remaining": null,
            "status": "100.0 / 100.0",
            "title": "Homework 2",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "100.0 / 100.0",
          "submitted": true,
          "title": "Homework 2",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1740931140000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1740931140
            ],
            "lateStatus": null,
            "releaseDate": "2025-02-24 00:00:00 +0800",
            "remaining": null,
            "status": "5.0 / 5.0",
            "title": "Lab 1 Checks",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "5.0 / 5.0",
          "submitted": true,
          "title": "Lab 1 Checks",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1741276740000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1741276740
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-03 00:00:00 +0800",
            "remaining": null,
            "status": "3.0 / 3.0",
            "title": "Lab 2 Checks",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "3.0 / 3.0",
          "submitted": true,
          "title": "Lab 2 Checks",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1741881540000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1741881540
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-10 00:00:00 +0800",
            "remaining": null,
            "status": "4.0 / 4.0",
            "title": "Lab 3 Checks",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "4.0 / 4.0",
          "submitted": true,
          "title": "Lab 3 Checks",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1743091140000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1743091140
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-06 12:00:00 +0800",
            "remaining": null,
            "status": "Submitted",
            "title": "Project 1.1",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "Submitted",
          "submitted": true,
          "title": "Project 1.1",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1742572800000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1742572800
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-17 00:00:00 +0800",
            "remaining": null,
            "status": "4.0 / 4.0",
            "title": "Lab 4 Checks",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "4.0 / 4.0",
          "submitted": true,
          "title": "Lab 4 Checks",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1743523140000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1743523140
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-18 12:00:00 +0800",
            "remaining": null,
            "status": "Submitted",
            "title": "Homework 3",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "Submitted",
          "submitted": true,
          "title": "Homework 3",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1743123600000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1743123600
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-24 00:00:00 +0800",
            "remaining": null,
            "status": "5.0 / 5.0",
            "title": "Lab 5 Checks",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "5.0 / 5.0",
          "submitted": true,
          "title": "Lab 5 Checks",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1744905540000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1744905540
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-27 11:59:00 +0800",
            "remaining": null,
            "status": "Submitted",
            "title": "Project 1.2",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "Submitted",
          "submitted": true,
          "title": "Project 1.2",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1743782340000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1743782340
            ],
            "lateStatus": null,
            "releaseDate": "2025-03-31 00:00:00 +0800",
            "remaining": null,
            "status": "2.0 / 2.0",
            "title": "Lab 6 Checks",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "2.0 / 2.0",
          "submitted": true,
          "title": "Lab 6 Checks",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1744732740000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1744732740
            ],
            "lateStatus": null,
            "releaseDate": "2025-04-01 12:00:00 +0800",
            "remaining": null,
            "status": "Submitted",
            "title": "Homework 4",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "Submitted",
          "submitted": true,
          "title": "Homework 4",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1744387140000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1744387140
            ],
            "lateStatus": null,
            "releaseDate": "2025-04-07 00:00:00 +0800",
            "remaining": null,
            "status": "1.0 / 1.0",
            "title": "Project 1.1 Offline Checking (Lab 7 Checks)",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "1.0 / 1.0",
          "submitted": true,
          "title": "Project 1.1 Offline Checking (Lab 7 Checks)",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1746460740000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1746460740
            ],
            "lateStatus": null,
            "releaseDate": "2025-04-11 12:00:00 +0800",
            "remaining": "1 week, 4 days left",
            "status": "No Submission",
            "title": "Proejct 2.1",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "No Submission",
          "submitted": false,
          "title": "Proejct 2.1",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1746460740000,
          "latedue": null,
          "raw": {
            "dueDate": [],
            "lateStatus": null,
            "releaseDate": null,
            "remaining": null,
            "status": "81.5 / 100.0",
            "title": "Midterm I",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "81.5 / 100.0",
          "submitted": true,
          "title": "Midterm I",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1744991940000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1744991940
            ],
            "lateStatus": null,
            "releaseDate": "2025-04-14 00:00:00 +0800",
            "remaining": null,
            "status": "2.0 / 2.0",
            "title": "Lab 8 Checks",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "2.0 / 2.0",
          "submitted": true,
          "title": "Lab 8 Checks",
          "url": "https://www.gradescope.com/courses/985840"
        },
        {
          "course": "Computer Architecture I",
          "due": 1746633540000,
          "latedue": null,
          "raw": {
            "dueDate": [
              1746633540
            ],
            "lateStatus": null,
            "releaseDate": "2025-04-18 17:21:00 +0800",
            "remaining": "1 week, 6 days left",
            "status": "No Submission",
            "title": "Homework 5",
            "url": "https://www.gradescope.com/courses/985840"
          },
          "status": "No Submission",
          "submitted": false,
          "title": "Homework 5",
          "url": "https://www.gradescope.com/courses/985840"
        },
      ]
    })
}