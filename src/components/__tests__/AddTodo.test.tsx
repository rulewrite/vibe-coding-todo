import { ChakraProvider } from '@chakra-ui/react';
import { fireEvent, render, screen } from '@testing-library/react';
import AddTodo from '../AddTodo';

describe('AddTodo 컴포넌트', () => {
  const mockOnAdd = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <ChakraProvider>
        <AddTodo onAdd={mockOnAdd} />
      </ChakraProvider>
    );
  };

  it('기본 렌더링이 정상적으로 동작한다', () => {
    renderComponent();
    expect(
      screen.getByPlaceholderText('할 일을 입력하세요...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '추가' })).toBeInTheDocument();
    expect(screen.getByLabelText('마감일')).toBeInTheDocument();
    expect(screen.getByDisplayValue('00:00')).toBeInTheDocument();
  });

  it('빠른 날짜 선택 버튼들이 정상적으로 렌더링된다', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: '내일' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3일 후' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1주일' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '2주일' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '1개월' })).toBeInTheDocument();
  });

  it('할 일 추가가 정상적으로 동작한다', () => {
    renderComponent();
    const input = screen.getByPlaceholderText('할 일을 입력하세요...');
    const addButton = screen.getByRole('button', { name: '추가' });
    fireEvent.change(input, { target: { value: '테스트 할 일' } });
    fireEvent.click(addButton);
    expect(mockOnAdd).toHaveBeenCalledWith('테스트 할 일', expect.any(String));
    expect(input).toHaveValue('');
  });

  it('빠른 날짜 선택 버튼이 정상적으로 동작한다', () => {
    renderComponent();
    const tomorrowButton = screen.getByRole('button', { name: '내일' });
    fireEvent.click(tomorrowButton);
    const dateInput = screen.getByLabelText('마감일') as HTMLInputElement;
    expect(dateInput.value).not.toBe('');
  });

  it('빈 할 일은 추가되지 않는다', () => {
    renderComponent();

    const addButton = screen.getByRole('button', { name: '추가' });
    fireEvent.click(addButton);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('시간 입력이 정상적으로 동작한다', () => {
    renderComponent();
    const timeInput = screen.getByDisplayValue('00:00') as HTMLInputElement;
    fireEvent.change(timeInput, { target: { value: '14:30' } });
    expect(timeInput.value).toBe('14:30');
  });
});
