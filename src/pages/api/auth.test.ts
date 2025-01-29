import { NextApiRequest, NextApiResponse } from 'next';
import { NextResponse } from 'next/server';
import { vi, describe, it, expect } from 'vitest';

import { isAuthorized } from './auth';
const spy = vi.spyOn(NextResponse, 'next');

describe("isAuthorized", () => {
  it("should return 403 if the authorization header is not correct", () => {
    const req = { headers: { authorization: "wrong" } } as NextApiRequest;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() }  as unknown as NextApiResponse;;

    isAuthorized(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({ error: "Unauthorized" });
  });

  it("should call .next() if the authorization header is correct", () => {
    spy.mockClear();
    const req = { headers: { authorization: process.env.AUTH_SECRET } } as NextApiRequest;
    const res = { status: vi.fn().mockReturnThis(), json: vi.fn() } as unknown as NextApiResponse;

    isAuthorized(req, res);

    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(NextResponse.next).toHaveBeenCalledOnce();
  });
});
