# #!/bin/bash

# # Define bucket name
# bucket_name="term-assignment-backend-bucket"

# # create the bucket
# aws s3api create-bucket --bucket $bucket_name 

# # upload files to the bucket
# aws s3 cp /Users/lib-user/Downloads/insertData.zip s3://$bucket_name/
# aws s3 cp /Users/lib-user/Downloads/myapp.zip s3://$bucket_name/
# aws s3 cp /Users/lib-user/Downloads/vaccineBackend.zip s3://$bucket_name/

# # run CloudFormation stack
# aws cloudformation create-stack --stack-name myteststack --template-body file:///Users/lib-user/Desktop/digital-vaccine-booking-system/backend/cloudFormation.yml

#!/bin/bash

# Define bucket name
bucket_name="term-assignment-backend-bucket"

# run CloudFormation stack to create S3 bucket
aws cloudformation create-stack --stack-name mybucketstack --template-body file:///Users/lib-user/Desktop/digital-vaccine-booking-system/backend/s3_bucket.yml

# Wait for the stack to be created
aws cloudformation wait stack-create-complete --stack-name mybucketstack

# upload files to the bucket
aws s3 cp /Users/lib-user/Downloads/insertData.zip s3://$bucket_name/
aws s3 cp /Users/lib-user/Downloads/myapp.zip s3://$bucket_name/
aws s3 cp /Users/lib-user/Downloads/vaccineBackend.zip s3://$bucket_name/

# run CloudFormation stack for the rest of your infrastructure
aws cloudformation create-stack --stack-name myteststack --template-body file:///Users/lib-user/Desktop/digital-vaccine-booking-system/backend/cloudFormation.yml

# You can also wait for this stack to complete if needed
aws cloudformation wait stack-create-complete --stack-name myteststack
