# PipeOps DevOps Setup

## Architecture
- **Frontend**: Next.js on port 3000
- **Backend**: Node.js/Express on port 5000  
- **CI/CD**: GitHub Actions
- **Container Orchestration**: Kubernetes
- **Monitoring**: Prometheus + Grafana

## CI/CD Pipeline
1. Code pushed to GitHub
2. GitHub Actions runs tests
3. Security scanning
4. Automatic deployment

## Monitoring
- Real-time service metrics
- Performance monitoring
- Alert system