import { renderHook } from '@testing-library/react-native';
import type { PermissionResponse } from 'expo';
import { PermissionStatus } from 'expo-modules-core';
import { useCameraPermissions } from 'expo-camera';
import { useCameraAccess } from './useCameraAccess';

jest.mock('expo-camera', () => ({
  useCameraPermissions: jest.fn(),
}));

const useCameraPermissionsMock = jest.mocked(useCameraPermissions);

function permission(values: Partial<PermissionResponse>): PermissionResponse {
  return {
    canAskAgain: true,
    expires: 0,
    granted: false,
    status: PermissionStatus.DENIED,
    ...values,
  } as PermissionResponse;
}

describe('useCameraAccess', () => {
  it('reports an undetermined permission', () => {
    useCameraPermissionsMock.mockReturnValue([null, jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCameraAccess());

    expect(result.current.status).toBe('undetermined');
  });

  it('reports granted permission', () => {
    useCameraPermissionsMock.mockReturnValue([permission({ granted: true, status: PermissionStatus.GRANTED }), jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCameraAccess());

    expect(result.current.status).toBe('granted');
  });

  it('reports denied permission when the system cannot ask again', () => {
    useCameraPermissionsMock.mockReturnValue([permission({ canAskAgain: false }), jest.fn(), jest.fn()]);

    const { result } = renderHook(() => useCameraAccess());

    expect(result.current.status).toBe('denied');
  });
});