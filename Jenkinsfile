pipeline {
    agent any

    triggers {
        githubPush()
    }

    environment {
        DOCKERHUB_USER = 'zainsheikh010'
        IMAGE_NAME = 'jobportal-app'
        APP_URL = 'http://34.229.217.192:3000'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/ZainSheikh001/DevOps-Assignment-03.git'
            }
        }

        stage('Cleanup') {
            steps {
                sh 'docker rm -f $(docker ps -aq) || true'
            }
        }

        stage('Build Image') {
            steps {
                sh 'docker build -t ${DOCKERHUB_USER}/${IMAGE_NAME}:latest .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USERNAME',
                    passwordVariable: 'PASSWORD'
                )]) {
                    sh 'echo $PASSWORD | docker login -u $USERNAME --password-stdin'
                    sh 'docker push ${DOCKERHUB_USER}/${IMAGE_NAME}:latest'
                }
            }
        }

        stage('Deploy') {
            steps {
                sh 'docker-compose -f docker-compose.yml down -v || true'
                sh 'docker-compose -f docker-compose.yml up -d --build'
                sh 'sleep 15'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh 'cd selenium-tests && docker build -t selenium-tests:latest .'
                sh 'docker run --rm --name selenium-runner -e APP_URL=http://34.229.217.192:3000 selenium-tests:latest'
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            emailext(
                to: 'zain.haq.ds@gmail.com',
                subject: "SUCCESS - Job Portal Tests Passed - Build ${env.BUILD_NUMBER}",
                body: """
Jenkins Pipeline - Build ${env.BUILD_NUMBER} - SUCCESS

Repository: https://github.com/ZainSheikh001/DevOps-Assignment-03
Triggered by: GitHub Push
Branch: main

TEST RESULTS:
=============
All 15 Selenium Test Cases PASSED

TC01: Homepage loads successfully - PASSED
TC02: Homepage body has content - PASSED
TC03: Register page loads successfully - PASSED
TC04: Register form has fullName field - PASSED
TC05: Register form has email field - PASSED
TC06: Register form has password field - PASSED
TC07: User can register successfully - PASSED
TC08: Login page loads successfully - PASSED
TC09: Login form has email field - PASSED
TC10: Login form has password field - PASSED
TC11: Login with invalid credentials stays on login - PASSED
TC12: User can login with valid credentials - PASSED
TC13: Jobs page loads successfully - PASSED
TC14: Profile page redirects unauthenticated user - PASSED
TC15: Logout redirects to login or homepage - PASSED

15 passing

App URL: http://34.229.217.192:3000
Jenkins: http://3.226.97.230:8080/job/jobportal-assignment3/

Regards,
Jenkins CI
                """
            )
        }
        failure {
            emailext(
                to: 'zain.haq.ds@gmail.com',
                subject: "FAILED - Job Portal Pipeline - Build ${env.BUILD_NUMBER}",
                body: """
Jenkins Pipeline - Build ${env.BUILD_NUMBER} - FAILED

Repository: https://github.com/ZainSheikh001/DevOps-Assignment-03
Triggered by: GitHub Push
Branch: main

Pipeline FAILED

Please check console output:
http://3.226.97.230:8080/job/jobportal-assignment3/

Regards,
Jenkins CI
                """
            )
        }
    }
}