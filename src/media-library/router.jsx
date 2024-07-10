import React from 'react';
import ListMedia from './components/ListMedia';

// names wont match param, just to create long enough chain
const router = [
  {
    path: 'media',
    element: <ListMedia />,
    children: [
      {
        path: ':title',
        children: [
          {
            path: ':season',
            children: [
              {
                path: ':sub-folder',
                children: [
                  {
                    path: ':extra-type',
                    children: [
                      {
                        path: ':episode',
                        children: [
                          {
                            path: ':and',
                            children: [
                              {
                                path: ':keep',
                                children: [
                                  {
                                    path: ':going',
                                    children: [
                                      {
                                        path: ':to',
                                        children: [
                                          {
                                            path: ':avoid',
                                            children: [
                                              {
                                                path: ':404s',

                                              },
                                            ],
                                          },
                                        ],
                                      },
                                    ],
                                  },
                                ],
                              },
                            ],
                          },
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export default router;
