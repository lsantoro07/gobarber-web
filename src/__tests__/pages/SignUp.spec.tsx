import React from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import SignUp from '../../pages/Signup';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('SignUp Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign up', async () => {
    const { getByText, getByPlaceholderText } = render(<SignUp />);

    const name = getByPlaceholderText('Nome');
    const email = getByPlaceholderText('E-mail');
    const password = getByPlaceholderText('Senha');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(email, { target: { value: 'johndoe@example.com.br' } });
    fireEvent.change(password, { target: { value: '123456' } });

    apiMock.onPost('/users').reply(200, {
      name: 'John Doe',
      email: 'johndoe@example.com.br',
      password: '123456',
    });

    fireEvent.click(getByText('Cadastrar'));

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to sign up with invalid data', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const name = getByPlaceholderText('Nome');
    const email = getByPlaceholderText('E-mail');
    const password = getByPlaceholderText('Senha');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(email, { target: { value: 'invalid-email' } });
    fireEvent.change(password, { target: { value: '123456' } });

    fireEvent.click(getByText('Cadastrar'));

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display a toast if sign up failed', async () => {
    const { getByPlaceholderText, getByText } = render(<SignUp />);

    const name = getByPlaceholderText('Nome');
    const email = getByPlaceholderText('E-mail');
    const password = getByPlaceholderText('Senha');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(email, { target: { value: 'johndoe@example.com.br' } });
    fireEvent.change(password, { target: { value: '123456' } });

    apiMock.onPost('/users').reply(401, {});

    fireEvent.click(getByText('Cadastrar'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
