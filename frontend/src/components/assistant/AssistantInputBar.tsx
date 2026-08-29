import React, { KeyboardEvent } from 'react';
import { Box, TextField, IconButton, Typography, CircularProgress, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ClearIcon from '@mui/icons-material/Clear';
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
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputQuery.trim() && !isDisabled) {
        onSend();
      }
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <TextField
        fullWidth
        multiline
        maxRows={3}
        placeholder="Ask AI Copilot for positioning, surge, or shift advice..."
        value={inputQuery}
        onChange={(e) => onChangeQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        InputProps={{
          endAdornment: (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, pl: 1 }}>
              {inputQuery.length > 0 && !isDisabled && (
                <Tooltip title="Clear text">
                  <IconButton
                    size="small"
                    onClick={() => onChangeQuery('')}
                    sx={{ color: VELOUR_TOKENS.textSecondary, p: 0.5 }}
                  >
                    <ClearIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}

              <IconButton
                onClick={onSend}
                disabled={!inputQuery.trim() || isDisabled}
                sx={{
                  backgroundColor: VELOUR_TOKENS.accentPrimary,
                  color: '#FFF',
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  boxShadow: '0 4px 12px rgba(124, 58, 237, 0.4)',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: VELOUR_TOKENS.accentPrimaryHover,
                    transform: 'scale(1.05)',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                    color: VELOUR_TOKENS.textSecondary,
                    boxShadow: 'none',
                  },
                }}
              >
                {isDisabled ? (
                  <CircularProgress size={18} sx={{ color: VELOUR_TOKENS.accentTeal }} />
                ) : (
                  <SendIcon sx={{ fontSize: 16 }} />
                )}
              </IconButton>
            </Box>
          ),
          sx: {
            backgroundColor: VELOUR_TOKENS.bgSurface2,
            borderRadius: 3.5,
            color: '#FFF',
            borderColor: VELOUR_TOKENS.borderSubtle,
            px: 2,
            py: 1,
            fontSize: 14,
            lineHeight: 1.5,
            '& fieldset': {
              borderColor: VELOUR_TOKENS.borderSubtle,
              borderRadius: 3.5,
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 217, 192, 0.3) !important',
            },
            '&.Mui-focused fieldset': {
              borderColor: `${VELOUR_TOKENS.accentTeal} !important`,
              borderWidth: '1px !important',
            },
          },
        }}
      />

      <Typography
        variant="caption"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: VELOUR_TOKENS.textSecondary,
          fontSize: 11,
          mt: 1.2,
          opacity: 0.8,
        }}
      >
        Press <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px' }}>Enter</kbd> to send • <kbd style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 5px', borderRadius: '4px' }}>Shift + Enter</kbd> for line break
      </Typography>
    </Box>
  );
};
