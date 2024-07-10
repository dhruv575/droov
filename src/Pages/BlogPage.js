import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import BlogData from '../Data/blogs.json';
import Typewriter from '../Components/Typewriter';
import './BlogPage.css';

const BlogPage = () => {
  const { title } = useParams();
  const blog = BlogData.find((blog) => blog.title.replace(/\s+/g, '-').toLowerCase() === title);
  const [markdownContent, setMarkdownContent] = useState('');

  useEffect(() => {
    fetch(blog.file)
      .then((response) => response.text())
      .then((text) => setMarkdownContent(text))
      .catch((error) => console.error('Error fetching markdown file:', error));
  }, [blog.file]);

  return (
    <div className="blog-page-wrapper">
      <div className="blog-content">
        <h1 className='blog-title' >
          <Typewriter text={blog.title} />
        </h1>
        <img src={blog.image} alt={blog.title} className="blog-image" />
        <p className="blog-subtitle">{blog.description}</p>
        <ReactMarkdown className="blog-text">{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
};

export default BlogPage;