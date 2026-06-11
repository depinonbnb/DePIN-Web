// google translate mutates the dom (wraps text nodes in <font>), which conflicts
// with react's reconciliation: react tries to removeChild/insertBefore on nodes
// translate has reparented, the browser throws NotFoundError, and the whole tree
// unmounts (black screen). guarding these two methods makes them no-op safely
// when the node was reparented instead of throwing. see facebook/react#11538.
export function patchDomForGoogleTranslate(): void {
  if (typeof Node !== 'function' || !Node.prototype) return;

  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this) {
      return child;
    }
    return originalRemoveChild.call(this, child) as T;
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(
    this: Node,
    newNode: T,
    referenceNode: Node | null,
  ): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      return newNode;
    }
    return originalInsertBefore.call(this, newNode, referenceNode) as T;
  };
}
