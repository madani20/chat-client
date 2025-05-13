// import { TestBed } from '@angular/core/testing';
// import { Message } from '../models/message';
// import { ChatStateService } from './chat-state.service';


// describe('ChatStateService', () => {
//   let service: ChatStateService;

//   beforeEach(() => {
//     TestBed.configureTestingModule({});
//     service = TestBed.inject(ChatStateService);
//   });

//   it('should add a message', () => {
//     const message: Message = { _id: '1', content: 'Test', userId: 'user1', conversationId: 'conv1', timestamp: new Date() +'', status: 'sent' };
//     service.addMessage(message);
//     expect(service.messages().length).toBe(1);
//     expect(service.messages()[0]).toEqual(message);
//   });

//   it('should update message status', () => {
//     const message: Message = { _id: '1', content: 'Test', userId: 'user1', conversationId: 'conv1', timestamp: new Date() +'', status: 'sending' };
//     service.addMessage(message);
//     service.updateMessageStatus('1', 'sent');
//     expect(service.messages()[0].status).toBe('sent');
//   });
// });