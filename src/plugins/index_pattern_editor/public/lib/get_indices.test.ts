/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import { getIndices, responseToItemArray } from './get_indices';
import { httpServiceMock } from '../../../../core/public/mocks';
import { ResolveIndexResponseItemIndexAttrs } from '../types';

export const successfulResponse = {
  indices: [
    {
      name: 'remoteCluster1:bar-01',
      attributes: ['open'],
    },
  ],
  aliases: [
    {
      name: 'f-alias',
      indices: ['freeze-index', 'my-index'],
    },
  ],
  data_streams: [
    {
      name: 'foo',
      backing_indices: ['foo-000001'],
      timestamp_field: '@timestamp',
    },
  ],
};

const mockGetTags = () => [];
const mockIsRollupIndex = () => false;

const http = httpServiceMock.createStartContract();
http.get.mockResolvedValue(successfulResponse);

describe('getIndices', () => {
  it('should work in a basic case', async () => {
    const result = await getIndices(http, mockIsRollupIndex, 'kibana', false);
    expect(result.length).toBe(3);
    expect(result[0].name).toBe('f-alias');
    expect(result[1].name).toBe('foo');
  });

  it('should ignore ccs query-all', async () => {
    expect((await getIndices(http, mockIsRollupIndex, '*:', false)).length).toBe(0);
  });

  it('should ignore a single comma', async () => {
    expect((await getIndices(http, mockIsRollupIndex, ',', false)).length).toBe(0);
    expect((await getIndices(http, mockIsRollupIndex, ',*', false)).length).toBe(0);
    expect((await getIndices(http, mockIsRollupIndex, ',foobar', false)).length).toBe(0);
  });

  it('response object to item array', () => {
    const result = {
      indices: [
        {
          name: 'test_index',
        },
        {
          name: 'frozen_index',
          attributes: ['frozen' as ResolveIndexResponseItemIndexAttrs],
        },
      ],
      aliases: [
        {
          name: 'test_alias',
          indices: [],
        },
      ],
      data_streams: [
        {
          name: 'test_data_stream',
          backing_indices: [],
          timestamp_field: 'test_timestamp_field',
        },
      ],
    };
    expect(responseToItemArray(result, mockGetTags)).toMatchSnapshot();
    expect(responseToItemArray({}, mockGetTags)).toEqual([]);
  });

  describe('errors', () => {
    it('should handle errors gracefully', async () => {
      http.get.mockImplementationOnce(() => {
        throw new Error('Test error');
      });
      const result = await getIndices(http, mockIsRollupIndex, 'kibana', false);
      expect(result.length).toBe(0);
    });
  });
});
