import { renderHook, act } from '@testing-library/react-hooks';
import React from 'react';
import { useToast, ToastProvider, ToastMessage } from '../../hooks/toast';

const toast = {
  id: 'id-123',
  type: 'success',
  title: 'Sucesso',
  description: 'Toast adicionado',
} as ToastMessage;

const mockSetState = jest.fn();
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useStateMock: any = (initState: any) => [initState, mockSetState];

describe('Toast hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to add and remove a toast', async () => {
    const stateSpy = jest
      .spyOn(React, 'useState')
      .mockImplementation(useStateMock);

    const { result } = renderHook(() => useToast(), {
      wrapper: ToastProvider,
    });

    act(() => {
      result.current.addToast(toast);
    });

    expect(stateSpy).toHaveBeenCalled();

    act(() => {
      result.current.removeToast(toast.id);
    });

    expect(stateSpy).toHaveBeenCalled();
  });

  // it('should be able to remove a toast', async () => {
  //   const useStateSpy = jest.spyOn(React, 'useState');

  //   const { result } = renderHook(() => useToast(), {
  //     wrapper: ToastProvider,
  //   });

  //   act(() => {
  //     result.current.removeToast(toast.id);
  //   });

  //   expect(useStateSpy).toHaveBeenCalled();
  // });
});
