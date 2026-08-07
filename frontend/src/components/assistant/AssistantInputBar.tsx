import React from 'react';
import { Box, TextField, IconButton, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { VELOUR_TOKENS } from '../../theme/palette';

interface AssistantInputBarProps {
  inputQuery: string;
  onChangeQuery: (value: string) => void;
  onSend: () => void;
  isDisabled?: boolean;
}

export const AssistantInputBar: React.FC<AssistantInputBarProps> = ({
  inputQuery,
  onChangeQuery,
  onSend,
  isDisabled = false,
}) => {
  return (
    <Box>
      <TextField
        fullWidth
        placeholder="Command AI Assistant..."
        value={inputQuery}
        onChange={(e) => onChangeQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSend()}
        InputProps={{
          endAdornment: (
            <IconButton
              onClick={onSend}
              disabled={!inputQuery.trim() || isDisabled}
              sx={{
                backgroundColor: VELOUR_TOKENS.accentPrimary,
                color: '#FFF',
                '&:hover': { backgroundColor: VELOUR_TOKENS.accentPrimaryHover },
                '&.Mui-disabled': { backgroundColor: VELOUR_TOKENS.bgSurface2, color: VELOUR_TOKENS.textSecondary },
              }}
            >
              <SendIcon sx={{ fontSize: 16 }} />
            </IconButton>
          ),
          sx: {
            backgroundColor: VELOUR_TOKENS.bgBase,
            borderRadius: 999,
            color: '#FFF',
            borderColor: VELOUR_TOKENS.borderSubtle,
            px: 2,
            py: 0.5,
            fontSize: 14,
          },
        }}
      />
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: VELOUR_TOKENS.textSecondary, fontSize: 11, mt: 1.5 }}>
        AI suggestions are generated in real-time. Verify before acting.
      </Typography>
    </Box>
  );
};
