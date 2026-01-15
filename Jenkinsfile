pipeline {
    agent any

    environment {
        IMAGE_NAME = "dlt"
        CONTAINER_NAME = "dlt-container"
        PORT = "5173"
    }

    stages {

        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Grigary1/dlt.git'
            }
        }

        stage('Check Node & Docker') {
            steps {
                sh '''
                node -v
                npm -v
                docker --version
                '''
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                docker build -t $IMAGE_NAME .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $CONTAINER_NAME || true
                docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run Docker Container') {
            steps {
                sh '''
                docker run -d \
                -p $PORT:$PORT \
                --name $CONTAINER_NAME \
                $IMAGE_NAME
                '''
            }
        }
    }

    post {
        success {
            echo 'React app deployed using Docker successfully 🎉'
        }
        failure {
            echo 'Deployment failed ❌'
        }
    }
}





// pipeline {
//     agent any

//     stages {
//         stage('Clone Code') {
//             steps {
//                 git branch: 'main',
//                     url: 'https://github.com/Grigary1/dlt.git'
//             }
//         }

//         stage('Check Node') {
//             steps {
//                 sh 'node -v || echo "Node not found"'
//                 sh 'npm -v || echo "NPM not found"'
//             }
//         }

//         stage('Install Dependencies') {
//             steps {
//                 sh 'npm install'
//             }
//         }

//         stage('Build React App') {
//             steps {
//                 sh 'npm run build'
//             }
//         }
//     }

//     post {
//         success {
//             echo 'React build successful 🎉'
//         }
//         failure {
//             echo 'Build failed ❌'
//         }
//     }
// }
