import request from 'supertest';
import { app, posts } from '../index.js';

describe('Blog Application', () => {
  // Clear posts array before each test
  beforeEach(() => {
    posts.length = 0;
  });

  describe('POST /posts', () => {
    it('should create a new post with valid data', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ postTitle: 'Test Title', postContent: 'Test Content', author: 'Test Author' });

      expect(response.status).toBe(302); // Should redirect
      expect(response.header.location).toBe('/');
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Test Title');
    });

    it('should not create a post with an empty title', async () => {
      const response = await request(app)
        .post('/posts')
        .send({ postTitle: '', postContent: 'Test Content', author: 'Test Author' });

      expect(response.status).toBe(200); // Should re-render the form
      expect(response.text).toContain('Title and content are required.');
      expect(posts.length).toBe(0);
    });

    it('should not create a post with empty content', async () => {
        const response = await request(app)
          .post('/posts')
          .send({ postTitle: 'Test Title', postContent: '', author: 'Test Author' });

        expect(response.status).toBe(200); // Should re-render the form
        expect(response.text).toContain('Title and content are required.');
        expect(posts.length).toBe(0);
      });
  });

  describe('POST /posts/update/:id', () => {
    it("should update a post's date on edit", async () => {
      // First, create a post
      const newPost = { id: 1, title: 'Original Title', content: 'Original Content', author: 'Original Author', date: new Date(2020, 0, 1) };
      posts.push(newPost);

      const originalDate = posts[0].date;

      // Now, update it
      const response = await request(app)
        .post('/posts/update/1')
        .send({ postTitle: 'Updated Title', postContent: 'Updated Content', author: 'Updated Author' });

      expect(response.status).toBe(302);
      expect(posts.length).toBe(1);
      expect(posts[0].title).toBe('Updated Title');
      expect(posts[0].date).not.toEqual(originalDate);
    });

    it('should not update a post with an empty title', async () => {
        // First, create a post
        const newPost = { id: 1, title: 'Original Title', content: 'Original Content', author: 'Original Author', date: new Date() };
        posts.push(newPost);

        // Now, try to update it with an empty title
        const response = await request(app)
          .post('/posts/update/1')
          .send({ postTitle: '', postContent: 'Updated Content', author: 'Updated Author' });

        expect(response.status).toBe(200);
        expect(response.text).toContain('Title and content are required.');
        expect(posts[0].title).toBe('Original Title'); // Should not have changed
      });
  });
});
