# Cache

The portal is designed around firmware-specific offline caches.

PSX8 documents AppCache-based host flows and per-host cache files/manifests. Preserve relative paths and regenerate the appropriate manifest whenever cached assets change.

This starter includes a root cache manifest for the shell only. Production exploit hosts should have their own manifests matching their exact asset trees.
