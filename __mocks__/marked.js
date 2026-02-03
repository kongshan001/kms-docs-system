const setOptionsMock = jest.fn();

const markedMock = jest.fn().mockReturnValue('<p>Test HTML</p>');
markedMock.setOptions = setOptionsMock;

module.exports = markedMock;
module.exports.setOptions = setOptionsMock;
