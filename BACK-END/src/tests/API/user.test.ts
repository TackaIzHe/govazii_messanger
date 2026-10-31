import {describe, expect, test} from '@jest/globals';
import {port, proto, host} from "../jest.config"
import axios from "axios"

const url = `${proto}://${host}:${port}`;

describe("User_controler", (()=> {
    test("asdf",(async() => {
        let res;
        try
        {
            res = (await axios.get(`${url}/user`)).data
        }
        catch (e)
        {
            console.log(`${url}/user`)
        }
        
        expect(res).toBe(1)
    }))
    it("get", (() => {
        expect(1).toBe(1)
    }))

    it("getAll", (() => {
        expect(1).toBe(9)
    }))

    it("post", (() => {
        expect(1).toBe(1)
    }))

    it("setName", (() => {
        expect(1).toBe(1)
    }))

    it("setAva", (() => {
        expect(1).toBe(1)
    }))

    it("del", (() => {
        expect(1).toBe(1)
    }))

    it("reg", (() => {
        expect(1).toBe(1)
    }))

    it("log", (() => {
        expect(1).toBe(1)
    }))

    it("getAuthInfoAc", (() => {
        expect(1).toBe(1)
    }))

    it("changPass", (() => {
        expect(1).toBe(1)
    }))
}))