# Candidate Microservice (Version 0.0.1)

## Overview

This microservice is designed to handle functionalities used by candidates, such as uploading there personal info and CV.

## Features

- **Post Candidate Info:** Candidates can upload there informataion.
- **Post Candidate CV:** Candidates can upload there CV using s3 signed url.
- **Preview Candidate CV:** Candidates can preview there current uploaded CV.

## Technologies

- **Language/Framework:** [ Typescript, Node.js with Express]
- **Database:** [ MongoDB ]
- **Authentication:** [ JWT ]
- **Cloud Services:** [ AWS SQS, AWS S3 ]
- **Containerization:** [ Docker ]

## Getting Started

### Prerequisites

- Install node v18.19.0

### Installation / Running

1. Clone the repository:

   ```bash
   git clone https://github.com/ShashwotBhattarai/candidate_microservice.git
   ```

2. Install NPM packages:

   ```bash
    npm install
   ```

3. Add env variables:

   ```bash
      DATABASEURI=
      JWTSECRET=
      AWS_ACCESS_KEY_ID=
      AWS_SECRET_ACCESS_KEY=
      AWS_REGION=
      S3_DEFAULT_BUCKET_NAME=
      S3_BAD_BUCKET_NAME=
      SQS_QUEUE_URL=
      ENV=
      PORT=
      ACCESS_CONTROL_ALLOW_ORIGIN_URL=http://localhost:{{PORT}}
   ```

4. Run the application:

   ```bash
    npm run start
   ```

5. To test apis:

   ```bash
      Health check API:

        curl --location 'http://localhost:{{CANDIDATE_MS_PORT}}/candidate/health'



      GetOne Candidate Info API:

         curl --location 'http://localhost:{{PORT}}/candidate/getCandidateInfo/{{user_id}}' \
          --header 'Authorization: Bearer {{<Token>}}'



      Get default bucket upload url API:

         curl --location 'http://localhost:{{PORT}}/candidate/defaultUploadUrl' \
         --header 's3filekey: {{<S3filekey>}}' \
         --header 'Authorization: Bearer {{<Token>}}'



      Get bad bucket upload url API:

         curl --location 'http://localhost:{{PORT}}/candidate/badbucketUploadURL' \
         --header 's3filekey: {{<S3filekey>}}' \
         --header 'Authorization: Bearer {{<Token>}}'



      Save Candidate info API:

         curl --location 'http://localhost:{{PORT}}/candidate/saveCandidateInfo/' \
         --header 'Content-Type: application/json' \
         --header 'Authorization: Bearer {{<Token>}}' \
         --data-raw '{
            "fullname": {{Fullname}},
            "email": "{{Email}}",
            "phone_number": "{{PhoneNumber}}"
            }'



      Update s3filekey API:

         curl --location
         --request POST
         'http://localhost:{{PORT}}/candidate/saveCandidateInfo/updateS3FileKey' \
         --header 's3filekey: {{<S3filekey>}}' \
         --header 'bucket: {{<bucketname(default/bad)>}}' \
         --header 'Authorization: Bearer {{<Token>}}'


   ```

### Test

```bash
   npm run test
```
