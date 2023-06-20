import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, ListGroup, Spinner, Form } from 'react-bootstrap';
import { FaCodeBranch } from 'react-icons/fa'; // Import the fork icon

const App = () => {
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForks, setShowForks] = useState(false); // State to toggle forked repositories

  useEffect(() => {
    const fetchRepositories = async () => {
      try {
        const response = await axios.get('https://api.github.com/user/repos', {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_GH_TOKEN}`, // Replace with your access token
          },
          params: {
            sort: 'pushed',
            direction: 'desc',
          },
        });
        setRepositories(response.data);
        
      } catch (error) {
        console.error(error);
       
      }finally{
        setTimeout(() => {
          setLoading(false)
        }, 2000);
      }
    };

    fetchRepositories();
  }, []);

  const toggleForks = () => {
    setShowForks(!showForks);
  };

  return (
    <Container className="app">
      <div className="toggle-container">
        <Form.Check
          type="switch"
          id="toggle-switch"
          label="Show Forked Repositories"
          checked={showForks}
          onChange={toggleForks}
        />
        <FaCodeBranch className="fork-icon" />
      </div>
      <h1>Your GitHub Repositories</h1>
      {loading ? (
        <div className="loading-spinner">
        <Spinner animation="border" role="status" variant="light">
          <span className="sr-only">...</span>
        </Spinner>
      </div>
      ) : (
        repositories.map(repo => {
          if (!showForks && repo.fork) {
            return null; // Skip rendering forked repositories if showForks is false
          }
          return (
            <Card
              key={repo.id}
              className={`my-3 ${repo.fork ? 'forked' : ''}`}
            >
              <Card.Body>
                <Card.Title>{repo.name}</Card.Title>
                <Card.Text>{repo.description}</Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush">
                <ListGroup.Item>
                  <strong>Language:</strong> {repo.language}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>Stars:</strong> {repo.stargazers_count}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>URL:</strong>{' '}
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.html_url}
                  </a>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          );
        })
      )}
    </Container>
  );
};

export default App;
