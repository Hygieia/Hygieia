import { MinutesPipe } from './minutes.pipe';

describe('MinutesPipe', () => {
    it('should create an instance', () => {
        const pipe = new MinutesPipe();
        expect(pipe).toBeTruthy();
    });

    it('should order by pipe the apiuser', () => {
        expect(new MinutesPipe().transform(2138712938712)).toBeTruthy();
    });
});
