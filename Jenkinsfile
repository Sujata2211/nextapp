pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "sujata658/my-nextjs-app"
        EC2_USER = "ubuntu"
        EC2_HOST = "43.204.24.3"   // replace this
    }

    stages {

        stage('Checkout Code') {
            steps {
                git branch: 'main', url: 'https://github.com/Sujata2211/nextapp.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh 'docker build -t $DOCKER_IMAGE:latest .'
                }
            }
        }

        stage('Login to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub_creds',
                                                 usernameVariable: 'DOCKER_USER',
                                                 passwordVariable: 'DOCKER_PASS')]) {
                    sh """
                        echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    """
                }
            }
        }

        stage('Push Image to Docker Hub') {
            steps {
                sh """
                    docker push $DOCKER_IMAGE:latest
                """
            }
        }

        stage('Deploy on EC2') {
            steps {
                sshagent(['ec2_ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no $EC2_USER@$EC2_HOST '
                        docker pull $DOCKER_IMAGE:latest &&
                        docker stop nextjs-app || true &&
                        docker rm nextjs-app || true &&
                        docker run -d -p 80:3000 --name nextjs-app $DOCKER_IMAGE:latest
                    '
                    """
                }
            }
        }
    }
}
