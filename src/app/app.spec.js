"use strict";

describe( "Wellness application module test:", function () {
        beforeEach(module("mflApp"));

        it("should expect the truth to be the truth", inject(function () {
            expect(true).toBeTruthy();
        }));
    });
