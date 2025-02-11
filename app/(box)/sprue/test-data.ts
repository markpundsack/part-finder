export const testSprue = {
  id: 'test-sprue-1',
  letter: 'A',
  imageUri: 'https://example.com/sprue-a.jpg',
  parts: [
    {
      number: '1',
      locations: [
        { x: 0.2, y: 0.3 }
      ]
    },
    {
      number: '2',
      locations: [
        { x: 0.4, y: 0.5 }
      ]
    },
    {
      number: '3',
      locations: [
        { x: 0.6, y: 0.7 },
        { x: 0.8, y: 0.2 }
      ]
    }
  ]
};

export const testBox = {
  id: 'test-box-1',
  name: 'Space Marines Tactical Squad',
  createdAt: new Date('2025-02-10'),
  lastAccessed: new Date('2025-02-10'),
  status: 'active',
  sprues: [
    {
      id: 'sprue-a',
      letter: 'A',
      imageUri: 'https://example.com/sprue-a.jpg',
      parts: [
        {
          number: '1',
          locations: [{ x: 0.2, y: 0.3 }]
        },
        {
          number: '2',
          locations: [{ x: 0.4, y: 0.5 }]
        }
      ]
    },
    {
      id: 'sprue-b',
      letter: 'B',
      imageUri: 'https://example.com/sprue-b.jpg',
      parts: [
        {
          number: '3',
          locations: [{ x: 0.3, y: 0.4 }]
        },
        {
          number: '4',
          locations: [
            { x: 0.6, y: 0.2 },
            { x: 0.7, y: 0.8 }
          ]
        }
      ]
    }
  ]
};
