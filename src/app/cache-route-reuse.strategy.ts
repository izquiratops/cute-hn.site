import {RouteReuseStrategy} from '@angular/router/';
import {ActivatedRouteSnapshot, DetachedRouteHandle} from '@angular/router';

export class CacheRouteReuseStrategy implements RouteReuseStrategy {
  storedRouteHandles = new Map<string, DetachedRouteHandle>();
  allowRetriveCache = new Set<string>(['feed']);

  // Fired *between* every route navigation
  // True means route not happening (!), ah future is the route we come from btw
  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === current.routeConfig;
  }

  // Route is allowed to be saved?
  // Find if there's a snapshot already on cache, if not then create component from scratch
  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path || '';
    return this.storedRouteHandles.has(path);
  }

  // Fetch component from cache
  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    const path = route.routeConfig?.path || '';
    return this.storedRouteHandles.get(path) as DetachedRouteHandle;
  }

  // Return true means run 'store' method
  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    const path = route.routeConfig?.path || '';
    return this.allowRetriveCache.has(path);
  }

  store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
    const path = route.routeConfig?.path || '';
    this.storedRouteHandles.set(path, detachedTree);
  }
}
