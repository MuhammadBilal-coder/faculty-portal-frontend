import { OAUTH_PROVIDERS } from '../../constants/appConstants';
import { Button } from '../common/Button';

export function OAuthButtons({ onAuth }) {
  return (
    <div className="oauth-grid">
      {OAUTH_PROVIDERS.map((provider) => (
        <Button
          key={provider.id}
          variant="outline"
          className={`oauth-btn oauth-${provider.id}`}
          onClick={() => onAuth(provider.label)}
        >
          <span aria-hidden="true" className="oauth-icon">
            {provider.icon}
          </span>
          <span>{provider.label}</span>
        </Button>
      ))}
    </div>
  );
}
