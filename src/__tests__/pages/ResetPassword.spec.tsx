import React from 'react';
import { render, fireEvent, wait, act } from '@testing-library/react';
import MockAdapter from 'axios-mock-adapter';
import ResetPassword from '../../pages/ResetPassword';
import api from '../../services/api';

const apiMock = new MockAdapter(api);

const mockedHistoryPush = jest.fn();
const mockedLocationSearch = { token: 'token-123' };
const mockedAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({
      push: mockedHistoryPush,
    }),
    Link: ({ children }: { children: React.ReactNode }) => children,
    useLocation: () => ({
      search: mockedLocationSearch.token,
    }),
  };
});

jest.mock('../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockedAddToast,
    }),
  };
});

describe('ResetPassword Page', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
    mockedAddToast.mockClear();
  });

  it('should be able to reset the password', async () => {
    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const novaSenha = getByPlaceholderText('Nova Senha');
    const confirmacaoSenha = getByPlaceholderText('Confirmação da Senha');

    fireEvent.change(novaSenha, { target: { value: '123456' } });
    fireEvent.change(confirmacaoSenha, { target: { value: '123456' } });

    apiMock.onPost('/password/reset').reply(204, {});

    await act(async () => {
      fireEvent.click(getByText('Alterar senha'));
    });

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/');
    });
  });

  it('should not be able to reset the password with invalid token', async () => {
    mockedLocationSearch.token = '';
    const { getByText, getByPlaceholderText } = render(<ResetPassword />);

    const novaSenha = getByPlaceholderText('Nova Senha');
    const confirmacaoSenha = getByPlaceholderText('Confirmação da Senha');

    fireEvent.change(novaSenha, { target: { value: '123456' } });
    fireEvent.change(confirmacaoSenha, { target: { value: '123456' } });

    apiMock.onPost('/password/reset').reply(204, {});

    await act(async () => {
      fireEvent.click(getByText('Alterar senha'));
    });

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should not be able to reset the password with invalid data', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const novaSenha = getByPlaceholderText('Nova Senha');
    const confirmacaoSenha = getByPlaceholderText('Confirmação da Senha');

    fireEvent.change(novaSenha, { target: { value: '123' } });
    fireEvent.change(confirmacaoSenha, { target: { value: '456' } });

    apiMock.onPost('/password/reset').reply(204, {});

    await act(async () => {
      fireEvent.click(getByText('Alterar senha'));
    });

    await wait(() => {
      expect(mockedAddToast).not.toHaveBeenCalled();
    });
  });

  it('should display a toast if recover password failed', async () => {
    const { getByPlaceholderText, getByText } = render(<ResetPassword />);

    const novaSenha = getByPlaceholderText('Nova Senha');
    const confirmacaoSenha = getByPlaceholderText('Confirmação da Senha');

    fireEvent.change(novaSenha, { target: { value: '123456' } });
    fireEvent.change(confirmacaoSenha, { target: { value: '123456' } });

    apiMock.onPost('/password/reset').reply(401, {});

    await act(async () => {
      fireEvent.click(getByText('Alterar senha'));
    });

    await wait(() => {
      expect(mockedAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });
});
