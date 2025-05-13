// import { provideHttpClient } from '@angular/common/http';
// import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
// import { TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { environment } from '../../../core/config/environment';
// import { Conversation } from '../models/conversation';
// import { Message, messages } from '../models/message';
// import { users } from '../models/user';
// import { ChatService } from './chat.service';

// describe('ChatService', () => {
//   let service: ChatService;
//   let httpMock: HttpTestingController;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [
//         ChatService,
//         provideHttpClient(),
//         provideHttpClientTesting()
//       ]
//     });
//     service = TestBed.inject(ChatService);
//     httpMock = TestBed.inject(HttpTestingController);
//   });

//   afterEach(() => {
//     httpMock.verify();
//   });

//   it('should be created', () => {
//     expect(service).toBeTruthy();
//   });

//   it('should persist a message with POST', fakeAsync(() => {
//     const message: Message = {
//       _id: '1',
//       conversationId: 'conv1',
//       userId: 'user1',
//       content: 'Test',
//       timestamp: '2023-01-01T00:00:00Z',
//       status: 'sending'
//     };
//     const expected: Message = { ...message, status: 'sent' };

//     let result: Message | undefined;
//     service.persistMessage(message).subscribe({
//       next: response => result = response
//     });

//     const req = httpMock.expectOne(environment.data.urlSendMessage);
//     expect(req.request.method).toBe('POST');
//     expect(req.request.body).toEqual(expected);
//     req.flush(expected);

//     tick();
//     expect(result).toEqual(expected);
//   }));

//   it('persistMessage should retry on 500 error', fakeAsync(() => {
//     const message: Message = { _id: '1', conversationId: 'conv1', userId: 'user1', content: 'Test', timestamp: '2023-01-01T00:00:00Z', status: 'sending' };
//     const expected: Message = { ...message, status: 'sent' };
  
//     service.persistMessage(message).subscribe({
//       next: response => expect(response).toEqual(expected)
//     });
  
//     const req1 = httpMock.expectOne(environment.data.urlSendMessage);
//     req1.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
//     const req2 = httpMock.expectOne(environment.data.urlSendMessage);
//     req2.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
//     const req3 = httpMock.expectOne(environment.data.urlSendMessage);
//     req3.flush(expected);
  
//     tick();
//   }));

//   it('should fetch recent messages for a conversation with GET', fakeAsync(() => {
//     const convId = '10';
//     const expectedMessages: messages = [
//       { _id: 'msg1', conversationId: '10', userId: 'user1', content: 'Hello 1', timestamp: '2023-01-01T00:01:00Z', status: 'sent' },
//       { _id: 'msg2', conversationId: '10', userId: 'user1', content: 'Hello 2', timestamp: '2023-01-01T00:02:00Z', status: 'sent' },
//       { _id: 'msg3', conversationId: '10', userId: 'user2', content: 'Hello 3', timestamp: '2023-01-01T00:03:00Z', status: 'sent' }
//     ];

//     let result: messages | undefined;
//     service.getRecentMessages(convId).subscribe({
//       next: response => result = response
//     });

//     const req = httpMock.expectOne(`${environment.data.urlRecentMessages}${convId}`);
//     expect(req.request.method).toBe('GET');
//     req.flush(expectedMessages);

//     tick();
//     expect(result).toEqual(expectedMessages);
//   }));

//   it('should fetch all conversations with GET', fakeAsync(() => {
//     const expectedConversations: Conversation[] = [
//       { _id: 'conv1', name: 'Conversation 1', participants: [], lastMessageId: '', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' },
//       { _id: 'conv2', name: 'Conversation 2', participants: [], lastMessageId: '', createdAt: '2023-01-01T00:00:00Z', updatedAt: '2023-01-01T00:00:00Z' }
//     ];

//     let result: Conversation[] | undefined;
//     service.getAllConversations().subscribe({
//       next: response => result = response
//     });

//     const req = httpMock.expectOne(environment.data.urlAllConversations);
//     expect(req.request.method).toBe('GET');
//     req.flush(expectedConversations);

//     tick();
//     expect(result).toEqual(expectedConversations);
//   }));

//   it('should fetch users with GET', fakeAsync(() => {
//     const expectedUsers: users = [
//       { _id: '1', username: 'John', email: 'homer@orange.fr', token: '', status: 'online' },
//       { _id: '2', username: 'Jane', email: 'marge@orange.fr', token: '', status: 'offline' }
//     ];

//     let result: users | undefined;
//     service.getUsers().subscribe({
//       next: response => result = response
//     });

//     const req = httpMock.expectOne(environment.data.urlUsers);
//     expect(req.request.method).toBe('GET');
//     req.flush(expectedUsers);

//     tick();
//     expect(result).toEqual(expectedUsers);
//   }));
// });