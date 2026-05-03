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
                sh '''
                    cd selenium-tests
                    docker build -t selenium-tests:latest .
                    docker run --rm \
                        --name selenium-runner \
                        -e APP_URL=http://34.229.217.192:3000 \
                        selenium-tests:latest
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
        }
        success {
            mail to: 'zain.haq.ds@gmail.com',
                 subject: "✅ Pipeline SUCCESS - Job Portal Tests Passed",
                 body: """
Hello,

The Jenkins pipeline ran successfully!

Repository: https://github.com/ZainSheikh001/DevOps-Assignment-03
Branch: main
Build: #${env.BUILD_NUMBER}
Status: SUCCESS ✅

All 15 Selenium test cases PASSED.

App is live at: http://34.229.217.192:3000

Jenkins: http://3.226.97.230:8080

Regards,
Jenkins CI
"""
        }
        failure {
            mail to: 'zain.haq.ds@gmail.com',
                 subject: "❌ Pipeline FAILED - Job Portal Tests Failed",
                 body: """
Hello,

The Jenkins pipeline FAILED!

Repository: https://github.com/ZainSheikh001/DevOps-Assignment-03
Branch: main
Build: #${env.BUILD_NUMBER}
Status: FAILED ❌

Please check the console output:
http://3.226.97.230:8080/job/jobportal-pipeline/

Regards,
Jenkins CI
"""
        }
    }
}