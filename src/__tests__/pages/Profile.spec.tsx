import React from 'react';
import {
  render,
  fireEvent,
  wait,
  getAllByTestId,
} from '@testing-library/react';

import MockAdapter from 'axios-mock-adapter';
import Profile from '../../pages/Profile';

import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedAddToast = jest.fn();
const mockedHistoryPush = jest.fn();

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

jest.mock('../../hooks/auth', () => {
  return {
    useAuth: () => ({
      user: {
        id: 'id-123',
        name: 'John Doe',
        email: 'johndoe@example.com.br',
        avatar_url: 'avatar.png',
      },
      updateUser: jest.fn(),
    }),
  };
});

describe('Dashboard Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to update the profile', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const name = getByPlaceholderText('Nome');
    const email = getByPlaceholderText('E-mail');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(email, { target: { value: 'johndoe@example.com.br' } });

    apiMock.onPut('/profile').reply(200, {
      name: 'John Doe',
      email: 'johndoe@example.com.br',
    });

    fireEvent.click(getByText('Confirmar mudanças'));

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should be able to update the password', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const senha = getByPlaceholderText('Senha atual');
    const novaSenha = getByPlaceholderText('Nova senha');
    const confirmacaoSenha = getByPlaceholderText('Confirmar senha');

    fireEvent.change(senha, { target: { value: '123456' } });
    fireEvent.change(novaSenha, { target: { value: '123456' } });
    fireEvent.change(confirmacaoSenha, { target: { value: '123456' } });

    apiMock.onPut('/profile').reply(200, {
      name: 'John Doe',
      email: 'johndoe@example.com.br',
    });

    fireEvent.click(getByText('Confirmar mudanças'));

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should not be able to update the profile with invalid data', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const name = getByPlaceholderText('Nome');
    const email = getByPlaceholderText('E-mail');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(email, { target: { value: 'invalid-email' } });

    apiMock.onPut('/profile').reply(200, {
      name: 'John Doe',
      email: 'johndoe@example.com.br',
    });

    fireEvent.click(getByText('Confirmar mudanças'));

    await wait(() => {
      expect(mockedHistoryPush).not.toHaveBeenCalled();
    });
  });

  it('should display an toast with update failed', async () => {
    const { getByPlaceholderText, getByText } = render(<Profile />);

    const name = getByPlaceholderText('Nome');
    const email = getByPlaceholderText('E-mail');

    fireEvent.change(name, { target: { value: 'John Doe' } });
    fireEvent.change(email, { target: { value: 'johndoe@example.com.br' } });

    apiMock.onPut('/profile').reply(401, {});

    fireEvent.click(getByText('Confirmar mudanças'));

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should be able to update the avatar', async () => {
    const { getByTestId } = render(<Profile />);

    const file = getByTestId('input-avatar');

    fireEvent.change(file, { target: { files: ['avatar.png'] } });

    apiMock.onPatch('/users/avatar').reply(200, {});

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'success',
        }),
      );
    });
  });

  it('should display an toast with update the avatar', async () => {
    const { getByTestId } = render(<Profile />);

    const file = getByTestId('input-avatar');

    fireEvent.change(file, { target: { files: null } });

    apiMock.onPatch('/users/avatar').reply(200, {});

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
