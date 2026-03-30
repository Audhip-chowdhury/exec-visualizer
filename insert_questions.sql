-- ============================================================
-- DSA Question Bank - MySQL DDL + INSERT statements
-- Source: dsa_question_bank_v3.json (v3.0.0)
-- Total questions: 109
-- All strings are plain ASCII (no multi-byte characters)
-- test_cases column uses MySQL JSON type
-- ============================================================

CREATE TABLE IF NOT EXISTS question_bank (
  id                   VARCHAR(20)   NOT NULL PRIMARY KEY,
  title                VARCHAR(255)  NOT NULL,
  description          TEXT          NOT NULL,
  level                ENUM('easy','medium','hard') NOT NULL,
  tag                  VARCHAR(60)   NOT NULL,
  hint                 TEXT,
  boilerplate          TEXT,
  test_cases           JSON,
  explanation          TEXT          COMMENT 'Beginner-friendly explanation of approach and why it works',
  constraints_note     TEXT          COMMENT 'Input size limits and edge case constraints',
  expected_complexity  VARCHAR(120)  COMMENT 'Time and space complexity',
  ascii_visual         TEXT          COMMENT 'ASCII art showing all test case inputs and outputs'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO question_bank
  (id, title, description, level, tag, hint, boilerplate, test_cases,
   explanation, constraints_note, expected_complexity, ascii_visual)
VALUES
  ('arr_01',
   'Find the maximum element',
   'Walk through the array and track the largest value seen so far. No sorting allowed.',
   'easy',
   'Arrays',
   'Use a variable to store the current max. Update it whenever you find something bigger.',
   'function findMax(arr) {
  // Step 1: assume the first element is the max
  // Step 2: loop through the rest
  // Step 3: update max whenever you find a bigger value
  // Step 4: return max
}',
   '[{"input":[[3,1,4,1,5,9]],"expected":9},{"input":[[1]],"expected":1},{"input":[[-3,-1,-4]],"expected":-1},{"input":[[7,7,7]],"expected":7}]',
   'Start by assuming the first element is the biggest. Then walk through every other element  -  if you find anything larger, update your "current max". At the end, your variable holds the answer. Think of it like scanning a list of prices and tracking the highest one.',
   '1 <= arr.length <= 10^5 | Values can be negative, zero, or positive | Array will never be empty',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [3,1,4,1,5,9]  =>  9
TC2: [1]  =>  1
TC3: [-3,-1,-4]  =>  -1
TC4: [7,7,7]  =>  7

TC1 input:
  +---+---+---+---+---+---+
  | 3 | 1 | 4 | 1 | 5 | 9 |
  +---+---+---+---+---+---+
   0   1   2   3   4   5  
TC1 output:
  9'),

  ('arr_02',
   'Reverse an array in-place',
   'Use two pointers from both ends and swap inward until they meet. Do not create a new array.',
   'easy',
   'Arrays',
   'Left pointer starts at 0, right pointer starts at arr.length - 1. Swap and move both inward.',
   'function reverseArray(arr) {
  // Step 1: set left = 0, right = arr.length - 1
  // Step 2: while left < right, swap arr[left] and arr[right]
  // Step 3: move left++ and right--
  // Step 4: return arr
}',
   '[{"input":[[1,2,3,4,5]],"expected":[5,4,3,2,1]},{"input":[[1,2]],"expected":[2,1]},{"input":[[42]],"expected":[42]},{"input":[[-1,0,1]],"expected":[1,0,-1]}]',
   'Imagine the array as a line of people. You swap the first and last person, then the second and second-to-last, working your way in until you meet in the middle. No extra space needed  -  just two index pointers moving toward each other.',
   '1 <= arr.length <= 10^5 | Values can be any integer | Odd-length arrays have a middle element that stays put',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1,2,3,4,5]  =>  [5,4,3,2,1]
TC2: [1,2]  =>  [2,1]
TC3: [42]  =>  [42]
TC4: [-1,0,1]  =>  [1,0,-1]

TC1 input:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  +---+---+---+---+---+
  | 5 | 4 | 3 | 2 | 1 |
  +---+---+---+---+---+
   0   1   2   3   4  '),

  ('arr_03',
   'Check if array is sorted',
   'Traverse once and return false the moment you find an out-of-order pair.',
   'easy',
   'Arrays',
   'Compare arr[i] with arr[i+1]. If arr[i] > arr[i+1], it is not sorted.',
   'function isSorted(arr) {
  // Step 1: loop from index 0 to arr.length - 2
  // Step 2: if arr[i] > arr[i+1], return false immediately
  // Step 3: if loop completes, return true
}',
   '[{"input":[[1,2,3,4,5]],"expected":true},{"input":[[1,3,2,4]],"expected":false},{"input":[[5]],"expected":true},{"input":[[1,1,1]],"expected":true}]',
   'Walk the array and compare each pair of neighbours. The moment you spot a pair where the left is bigger than the right, you know the array is not in ascending order  -  return false immediately. If you reach the end without finding any such pair, it is sorted.',
   '1 <= arr.length <= 10^5 | Equal adjacent elements are allowed (non-strictly sorted is still considered sorted here)',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1,2,3,4,5]  =>  true
TC2: [1,3,2,4]  =>  false
TC3: [5]  =>  true
TC4: [1,1,1]  =>  true

TC1 input:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  true'),

  ('arr_04',
   'Move all zeros to the end',
   'Place non-zero elements first using a write pointer, then fill the rest with zeros.',
   'medium',
   'Arrays',
   'writePtr starts at 0. For each non-zero element, place it at writePtr and advance. Then fill remaining positions with 0.',
   'function moveZeros(arr) {
  // Step 1: create a writePtr = 0
  // Step 2: loop through arr, for each non-zero element place it at arr[writePtr] and increment writePtr
  // Step 3: fill the rest of arr with zeros from writePtr onwards
  // Step 4: return arr
}',
   '[{"input":[[0,1,0,3,12]],"expected":[1,3,12,0,0]},{"input":[[0,0,0]],"expected":[0,0,0]},{"input":[[1,2,3]],"expected":[1,2,3]},{"input":[[0]],"expected":[0]}]',
   'Use a "write pointer" that only advances when you place a non-zero element. First pass: copy all non-zeros to the front. Second pass (or just fill after): overwrite remaining slots with zeros. The order of non-zero elements is preserved.',
   '1 <= arr.length <= 10^4 | Array contains only integers (can be negative) | Must modify in-place; relative order of non-zero elements must be maintained',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [0,1,0,3,12]  =>  [1,3,12,0,0]
TC2: [0,0,0]  =>  [0,0,0]
TC3: [1,2,3]  =>  [1,2,3]
TC4: [0]  =>  [0]

TC1 input:
  +---+---+---+---+----+
  | 0 | 1 | 0 | 3 | 12 |
  +---+---+---+---+----+
   0   1   2   3   4   
TC1 output:
  +---+---+----+---+---+
  | 1 | 3 | 12 | 0 | 0 |
  +---+---+----+---+---+
   0   1   2    3   4  '),

  ('arr_05',
   'Find pair with target sum',
   'Use two pointers on a sorted array  -  move them inward based on the current sum compared to target.',
   'medium',
   'Arrays',
   'If sum < target move left right. If sum > target move right left. Return indices when equal.',
   'function findPair(arr, target) {
  // Step 1: sort arr first (or assume sorted)
  // Step 2: set left = 0, right = arr.length - 1
  // Step 3: compute sum = arr[left] + arr[right]
  // Step 4: if sum === target return [left, right]
  // Step 5: if sum < target, left++. if sum > target, right--
  // Step 6: return [] if not found
}',
   '[{"input":[[1,2,3,4,6],6],"expected":[1,3]},{"input":[[1,2,3,4,6],10],"expected":[3,4]},{"input":[[1,2,3],7],"expected":[]},{"input":[[1,5],6],"expected":[0,1]}]',
   'With a sorted array, two pointers starting at opposite ends let you home in on the target sum efficiently. If the sum is too small, moving the left pointer right increases it. If too large, moving the right pointer left decreases it. You never need to backtrack.',
   '2 <= arr.length <= 10^5 | Array must be sorted (sort it first if not) | Exactly one pair guaranteed to exist in most cases; return [] if none found',
   'Time: O(n) after sorting | Space: O(1)',
   '--- All Test Cases ---
TC1: [1,2,3,4,6], 6  =>  [1,3]
TC2: [1,2,3,4,6], 10  =>  [3,4]
TC3: [1,2,3], 7  =>  []
TC4: [1,5], 6  =>  [0,1]

TC1 input:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 6 |
  +---+---+---+---+---+
   0   1   2   3   4  
  arg2: 6
TC1 output:
  +---+---+
  | 1 | 3 |
  +---+---+
   0   1  '),

  ('arr_06',
   'Maximum subarray sum',
   'Kadane''s algorithm  -  carry forward a running sum and reset when it goes negative.',
   'medium',
   'Arrays',
   'curr = max(arr[i], curr + arr[i]). Update best whenever curr is larger.',
   'function maxSubarraySum(arr) {
  // Step 1: set curr = arr[0], best = arr[0]
  // Step 2: loop from index 1
  // Step 3: curr = Math.max(arr[i], curr + arr[i])
  // Step 4: best = Math.max(best, curr)
  // Step 5: return best
}',
   '[{"input":[[-2,1,-3,4,-1,2,1,-5,4]],"expected":6},{"input":[[1]],"expected":1},{"input":[[-1,-2,-3]],"expected":-1},{"input":[[5,4,-1,7,8]],"expected":23}]',
   'Kadane''s insight: at each position, decide whether to extend the current subarray or start fresh. If the running sum goes negative, starting fresh from the current element is always better. Track the best sum seen so far throughout the scan.',
   '1 <= arr.length <= 10^5 | Values can be negative  -  the answer may be negative if all elements are negative | Array is never empty',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [-2,1,-3,4,-1,2,1,-5,4]  =>  6
TC2: [1]  =>  1
TC3: [-1,-2,-3]  =>  -1
TC4: [5,4,-1,7,8]  =>  23

TC1 input:
  +----+---+----+---+----+---+---+----+---+
  | -2 | 1 | -3 | 4 | -1 | 2 | 1 | -5 | 4 |
  +----+---+----+---+----+---+---+----+---+
   0    1   2    3   4    5   6   7    8  
TC1 output:
  6'),

  ('arr_07',
   'Rotate array by k steps',
   'Reverse the whole array, then reverse the first k and the remaining n-k elements separately.',
   'hard',
   'Arrays',
   'Three reversal trick. Normalize k = k % n first to handle k larger than array length.',
   'function rotateArray(arr, k) {
  // Step 1: normalize k = k % arr.length
  // Step 2: reverse the entire array
  // Step 3: reverse arr[0..k-1]
  // Step 4: reverse arr[k..n-1]
  // Helper: write a reverse(arr, start, end) function
}',
   '[{"input":[[1,2,3,4,5,6,7],3],"expected":[5,6,7,1,2,3,4]},{"input":[[-1,-100,3,99],2],"expected":[3,99,-1,-100]},{"input":[[1,2],1],"expected":[2,1]},{"input":[[1,2,3],3],"expected":[1,2,3]}]',
   'The three-reversal trick works because reversing the whole array and then reversing two halves at positions k and n-k cancels out in exactly the right way to achieve a rotation. Always normalize k first  -  rotating by n steps is the same as not rotating at all.',
   '1 <= arr.length <= 10^5 | 0 <= k (k can be larger than arr.length, use k % n) | In-place required',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1,2,3,4,5,6,7], 3  =>  [5,6,7,1,2,3,4]
TC2: [-1,-100,3,99], 2  =>  [3,99,-1,-100]
TC3: [1,2], 1  =>  [2,1]
TC4: [1,2,3], 3  =>  [1,2,3]

TC1 input:
  +---+---+---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 |
  +---+---+---+---+---+---+---+
   0   1   2   3   4   5   6  
  arg2: 3
TC1 output:
  +---+---+---+---+---+---+---+
  | 5 | 6 | 7 | 1 | 2 | 3 | 4 |
  +---+---+---+---+---+---+---+
   0   1   2   3   4   5   6  '),

  ('arr_08',
   'Merge two sorted arrays',
   'Use three pointers  -  one per input array and one for output  -  and pick the smaller element each step.',
   'medium',
   'Arrays',
   'Compare arr1[i] and arr2[j]. Push the smaller one to result and advance that pointer.',
   'function mergeSorted(arr1, arr2) {
  // Step 1: create result = [], i = 0, j = 0
  // Step 2: while both arrays have elements, push the smaller one
  // Step 3: push remaining elements from arr1 or arr2
  // Step 4: return result
}',
   '[{"input":[[1,3,5],[2,4,6]],"expected":[1,2,3,4,5,6]},{"input":[[],[1,2]],"expected":[1,2]},{"input":[[1],[]],"expected":[1]},{"input":[[1,2,3],[4,5,6]],"expected":[1,2,3,4,5,6]}]',
   'Think of two sorted piles of cards. You always pick the smaller top card from either pile. When one pile runs out, just append the rest of the other pile. The result is always sorted because both inputs were already sorted.',
   '0 <= arr1.length, arr2.length <= 10^5 | Both arrays are sorted in non-decreasing order | Either array can be empty',
   'Time: O(n + m) | Space: O(n + m)',
   '--- All Test Cases ---
TC1: [1,3,5], [2,4,6]  =>  [1,2,3,4,5,6]
TC2: [], [1,2]  =>  [1,2]
TC3: [1], []  =>  [1]
TC4: [1,2,3], [4,5,6]  =>  [1,2,3,4,5,6]

TC1 input:
  +---+---+---+
  | 1 | 3 | 5 |
  +---+---+---+
   0   1   2  
  arg2: [2,4,6]
TC1 output:
  +---+---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 | 6 |
  +---+---+---+---+---+---+
   0   1   2   3   4   5  '),

  ('ll_01',
   'Insert node at head',
   'Create a new node, point its next to the current head, update head.',
   'easy',
   'Linked List',
   'newNode.next = head. head = newNode.',
   'class ListNode {
  constructor(val) { this.val = val; this.next = null; }
}

function insertAtHead(head, val) {
  // Step 1: create newNode with val
  // Step 2: newNode.next = head
  // Step 3: return newNode as new head
}',
   '[{"input":[null,1],"expected":[1]},{"input":[[1,2,3],0],"expected":[0,1,2,3]}]',
   'A linked list node holds a value and a pointer to the next node. Inserting at the head is the cheapest operation  -  just make the new node point to the old head, then declare the new node the head. No traversal needed.',
   'Value can be any integer | head can be null (empty list) | Always returns a new head node',
   'Time: O(1) | Space: O(1)',
   '--- All Test Cases ---
TC1: null, 1  =>  [1]->NULL
TC2: [1]->[2]->[3]->NULL, 0  =>  [0]->[1]->[2]->[3]->NULL

TC1:
  In:  null, 1
  Out: [1]'),

  ('ll_02',
   'Find length of linked list',
   'Walk node by node, increment a counter until you hit null.',
   'easy',
   'Linked List',
   'Start count at 0. Move curr = curr.next each step. Stop when curr is null.',
   'function listLength(head) {
  // Step 1: set count = 0, curr = head
  // Step 2: while curr is not null, count++ and curr = curr.next
  // Step 3: return count
}',
   '[{"input":[[1,2,3,4]],"expected":4},{"input":[[1]],"expected":1},{"input":[null],"expected":0}]',
   'Unlike arrays, a linked list has no .length property. You must walk it node by node. Use a counter starting at zero and keep moving to curr.next until you reach null. The counter at that point is the length.',
   'List can be empty (returns 0) | No maximum length given but assume up to 10^4 nodes',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1]->[2]->[3]->[4]->NULL  =>  4
TC2: [1]->NULL  =>  1
TC3: null  =>  0

TC1 (linked list):
  In:  [1]->[2]->[3]->[4]->NULL
  Out: 4'),

  ('ll_03',
   'Delete a node by value',
   'Traverse with a prev pointer. Unlink the target node by rewiring the next pointer.',
   'easy',
   'Linked List',
   'When curr.val === target, set prev.next = curr.next. Handle head deletion separately.',
   'function deleteNode(head, val) {
  // Step 1: handle if head.val === val, return head.next
  // Step 2: traverse with prev and curr
  // Step 3: when curr.val === val, set prev.next = curr.next
  // Step 4: return head
}',
   '[{"input":[[1,2,3,4],3],"expected":[1,2,4]},{"input":[[1,2,3],1],"expected":[2,3]},{"input":[[1],1],"expected":[]}]',
   'To remove a node, you need to make the node before it skip over it. Keep a prev pointer one step behind curr. When curr holds the target value, set prev.next = curr.next to bypass it. The special case is deleting the head  -  just return head.next.',
   'Value is guaranteed to exist in the list | List has at least 1 node | Only first occurrence is deleted',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1]->[2]->[3]->[4]->NULL, 3  =>  [1]->[2]->[4]->NULL
TC2: [1]->[2]->[3]->NULL, 1  =>  [2]->[3]->NULL
TC3: [1]->NULL, 1  =>  NULL

TC1 (linked list):
  In:  [1]->[2]->[3]->[4]->NULL
  arg2: 3
  Out: [1]->[2]->[4]->NULL'),

  ('ll_04',
   'Reverse a linked list',
   'Use three pointers: prev, curr, next. Flip the next pointer at each step.',
   'medium',
   'Linked List',
   'Save next = curr.next. Set curr.next = prev. Move prev = curr, curr = next.',
   'function reverseList(head) {
  // Step 1: set prev = null, curr = head
  // Step 2: while curr is not null:
  //   save next = curr.next
  //   curr.next = prev
  //   prev = curr
  //   curr = next
  // Step 3: return prev as new head
}',
   '[{"input":[[1,2,3,4,5]],"expected":[5,4,3,2,1]},{"input":[[1,2]],"expected":[2,1]},{"input":[[1]],"expected":[1]}]',
   'You cannot go backwards in a singly linked list, so you must flip each arrow one at a time. Save the next node before overwriting its pointer. After flipping, move all three pointers forward one step. When curr is null, prev is the new head.',
   '1 <= list length <= 5000 | Values can be any integer | Must reverse in-place',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1]->[2]->[3]->[4]->[5]->NULL  =>  [5]->[4]->[3]->[2]->[1]->NULL
TC2: [1]->[2]->NULL  =>  [2]->[1]->NULL
TC3: [1]->NULL  =>  [1]->NULL

TC1 (linked list):
  In:  [1]->[2]->[3]->[4]->[5]->NULL
  Out: [5]->[4]->[3]->[2]->[1]->NULL'),

  ('ll_05',
   'Find the middle node',
   'Slow pointer moves one step, fast moves two. When fast hits the end, slow is at the middle.',
   'medium',
   'Linked List',
   'While fast and fast.next exist, slow = slow.next, fast = fast.next.next.',
   'function findMiddle(head) {
  // Step 1: set slow = head, fast = head
  // Step 2: while fast and fast.next are not null
  //   slow = slow.next
  //   fast = fast.next.next
  // Step 3: return slow
}',
   '[{"input":[[1,2,3,4,5]],"expected":3},{"input":[[1,2,3,4]],"expected":3},{"input":[[1]],"expected":1}]',
   'The fast/slow pointer trick: since fast moves twice as fast, when fast reaches the end, slow is exactly at the middle. For even-length lists the "middle" is the second of the two middle nodes.',
   '1 <= list length <= 10^4 | For even-length lists return the second middle node',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1]->[2]->[3]->[4]->[5]->NULL  =>  3
TC2: [1]->[2]->[3]->[4]->NULL  =>  3
TC3: [1]->NULL  =>  1

TC1 (linked list):
  In:  [1]->[2]->[3]->[4]->[5]->NULL
  Out: 3'),

  ('ll_06',
   'Detect a cycle',
   'Floyd''s algorithm  -  slow moves one step, fast moves two. They meet if there is a cycle.',
   'medium',
   'Linked List',
   'If fast or fast.next becomes null, there is no cycle. If slow === fast, there is a cycle.',
   'function hasCycle(head) {
  // Step 1: set slow = head, fast = head
  // Step 2: while fast and fast.next are not null
  //   slow = slow.next
  //   fast = fast.next.next
  //   if slow === fast return true
  // Step 3: return false
}',
   '[{"input":[[3,2,0,-4],1],"expected":true},{"input":[[1,2],0],"expected":true},{"input":[[1],-1],"expected":false}]',
   'If a list has a cycle, fast laps slow  -  they will eventually meet. If there is no cycle, fast falls off the end (hits null). Think of two runners on a track: if the track is circular, the faster one will catch the slower one.',
   'List can have 0 to 10^4 nodes | Cycle is indicated by a tail node whose next points back to a previous node | No cycle means fast reaches null',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [3]->[2]->[0]->[-4]->NULL, 1  =>  true
TC2: [1]->[2]->NULL, 0  =>  true
TC3: [1]->NULL, -1  =>  false

TC1 (linked list):
  In:  [3]->[2]->[0]->[-4]->NULL
  arg2: 1
  Out: true'),

  ('ll_07',
   'Merge two sorted linked lists',
   'Compare heads iteratively and stitch the smaller node in at each step.',
   'medium',
   'Linked List',
   'Use a dummy head node to simplify the merge. Attach the remaining list when one runs out.',
   'function mergeLists(l1, l2) {
  // Step 1: create a dummy node, set curr = dummy
  // Step 2: while both l1 and l2 are not null
  //   pick the smaller, attach to curr.next
  //   advance that list and curr
  // Step 3: attach the remaining list
  // Step 4: return dummy.next
}',
   '[{"input":[[1,2,4],[1,3,4]],"expected":[1,1,2,3,4,4]},{"input":[[],[0]],"expected":[0]},{"input":[[],[]],"expected":[]}]',
   'A dummy node at the start removes the special case of setting the head. At each step, attach whichever list''s current node is smaller. When one list runs out, just attach the rest of the other  -  it is already sorted.',
   'Both lists are sorted in non-decreasing order | Either list can be empty | Values can be negative',
   'Time: O(n + m) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1]->[2]->[4]->NULL, [1]->[3]->[4]->NULL  =>  [1]->[1]->[2]->[3]->[4]->[4]->NULL
TC2: NULL, [0]->NULL  =>  [0]->NULL
TC3: NULL, NULL  =>  NULL

TC1 (linked list):
  In:  [1]->[2]->[4]->NULL
  arg2: [1,3,4]
  Out: [1]->[1]->[2]->[3]->[4]->[4]->NULL'),

  ('ll_08',
   'Remove nth node from end',
   'Use two pointers with a gap of n. When the front hits null, the back is the target.',
   'hard',
   'Linked List',
   'Advance the ahead pointer n steps first. Then move both until ahead is null.',
   'function removeNthFromEnd(head, n) {
  // Step 1: create dummy node pointing to head
  // Step 2: move ahead pointer n+1 steps from dummy
  // Step 3: move both behind and ahead until ahead is null
  // Step 4: behind.next = behind.next.next
  // Step 5: return dummy.next
}',
   '[{"input":[[1,2,3,4,5],2],"expected":[1,2,3,5]},{"input":[[1],1],"expected":[]},{"input":[[1,2],1],"expected":[1]}]',
   'By keeping two pointers exactly n steps apart, when the front reaches the end, the back is pointing at the node just before the target. Use a dummy node before head to handle the edge case of removing the head itself.',
   '1 <= list length <= 30 | 1 <= n <= list length | n is always valid',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1]->[2]->[3]->[4]->[5]->NULL, 2  =>  [1]->[2]->[3]->[5]->NULL
TC2: [1]->NULL, 1  =>  NULL
TC3: [1]->[2]->NULL, 1  =>  [1]->NULL

TC1 (linked list):
  In:  [1]->[2]->[3]->[4]->[5]->NULL
  arg2: 2
  Out: [1]->[2]->[3]->[5]->NULL'),

  ('sq_01',
   'Implement a stack using an array',
   'Build push, pop, peek, and isEmpty using a plain array. No built-in stack class allowed.',
   'easy',
   'Stack & Queue',
   'Use the end of the array as the top of the stack.',
   'class Stack {
  constructor() {
    this.data = [];
  }
  push(val) {
    // add val to the top
  }
  pop() {
    // remove and return top element
  }
  peek() {
    // return top element without removing
  }
  isEmpty() {
    // return true if stack is empty
  }
}',
   '[{"ops":["push","push","push","pop","peek","isEmpty"],"args":[[1],[2],[3],[],[],[]],"expected":[null,null,null,3,2,false],"note":"push 1,2,3 then pop=3, peek=2, isEmpty=false"},{"ops":["push","pop","isEmpty"],"args":[[42],[],[]],"expected":[null,42,true],"note":"single push then pop, stack empty"},{"ops":["push","push","pop","push","peek"],"args":[[5],[10],[],[7],[]],"expected":[null,null,10,null,7],"note":"interleaved push/pop"},{"ops":["isEmpty"],"args":[[]],"expected":[true],"note":"empty stack from the start"}]',
   'A stack is LIFO  -  Last In, First Out. Treat the end of an array as the top. Push appends to the end; pop removes from the end. Peek looks at the last element without removing it. This mirrors how a stack of plates works.',
   'Assume push is always called with a valid value | pop and peek on an empty stack return undefined (handle gracefully) | No size limit specified',
   'Time: O(1) for all operations | Space: O(n)',
   'Op          | Args         | Returns
------------+--------------+----------
push        | (1)          | -
push        | (2)          | -
push        | (3)          | -
pop         | ()           | 3
peek        | ()           | 2
isEmpty     | ()           | false

Other test cases:
  TC2: single push then pop, stack empty  =>  [42,true]
  TC3: interleaved push/pop  =>  [10,7]
  TC4: empty stack from the start  =>  [true]'),

  ('sq_02',
   'Implement a queue using an array',
   'Build enqueue and dequeue tracking front and rear indices manually.',
   'easy',
   'Stack & Queue',
   'Enqueue adds to the rear. Dequeue removes from the front.',
   'class Queue {
  constructor() {
    this.data = [];
    this.front = 0;
  }
  enqueue(val) {
    // add val to the rear
  }
  dequeue() {
    // remove and return front element
  }
  isEmpty() {
    // return true if queue is empty
  }
}',
   '[{"ops":["enqueue","enqueue","enqueue","dequeue","dequeue"],"args":[[1],[2],[3],[],[]],"expected":[null,null,null,1,2],"note":"enqueue 1,2,3 then dequeue twice gives 1,2"},{"ops":["enqueue","dequeue","isEmpty"],"args":[[99],[],[]],"expected":[null,99,true],"note":"single enqueue dequeue leaves empty"},{"ops":["enqueue","enqueue","dequeue","enqueue","dequeue"],"args":[[10],[20],[],[30],[]],"expected":[null,null,10,null,20],"note":"interleaved enqueue dequeue"},{"ops":["isEmpty"],"args":[[]],"expected":[true],"note":"empty queue from the start"}]',
   'A queue is FIFO  -  First In, First Out. Like a ticket line: you join at the back and leave from the front. Enqueue adds to the end of the array; dequeue removes from the front. Track a front index instead of splicing (which is expensive).',
   'Assume valid usage (no dequeue from empty queue in tests) | No maximum size specified',
   'Time: O(1) amortized for all operations | Space: O(n)',
   'Op          | Args         | Returns
------------+--------------+----------
enqueue     | (1)          | -
enqueue     | (2)          | -
enqueue     | (3)          | -
dequeue     | ()           | 1
dequeue     | ()           | 2

Other test cases:
  TC2: single enqueue dequeue leaves empty  =>  [99,true]
  TC3: interleaved enqueue dequeue  =>  [10,20]
  TC4: empty queue from the start  =>  [true]'),

  ('sq_03',
   'Valid parentheses',
   'Push opening brackets onto the stack. On a closing bracket, pop and check if it matches.',
   'medium',
   'Stack & Queue',
   'Use a map to pair closing brackets with their opening counterparts.',
   'function isValid(s) {
  // Step 1: create an empty stack
  // Step 2: loop through each character
  //   if opening bracket, push
  //   if closing bracket, pop and check match
  // Step 3: return stack.length === 0
}',
   '[{"input":["()[]{}"],"expected":true},{"input":["(]"],"expected":false},{"input":["{[]}"],"expected":true},{"input":["([)]"],"expected":false}]',
   'Whenever you see an opening bracket, push it. When you see a closing bracket, the top of the stack must be its matching opener  -  otherwise the string is invalid. At the end, the stack must be empty (all openers were closed).',
   'String contains only ()[]{}  | 1 <= s.length <= 10^4 | Empty string is considered valid',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: "()[]{}"  =>  true
TC2: "(]"  =>  false
TC3: "{[]}"  =>  true
TC4: "([)]"  =>  false

TC1:
  In:  "()[]{}"
  Out: true'),

  ('sq_04',
   'Implement stack using two queues',
   'Use one queue for storage and one as a helper to simulate LIFO order on push.',
   'medium',
   'Stack & Queue',
   'On push: enqueue to q2, drain all of q1 into q2, then swap q1 and q2.',
   'class StackUsingQueues {
  constructor() {
    this.q1 = [];
    this.q2 = [];
  }
  push(val) {
    // enqueue to q2, move all of q1 into q2, swap q1 and q2
  }
  pop() {
    // dequeue from q1
  }
  peek() {
    // return front of q1
  }
}',
   '[{"ops":["push","push","push","pop","peek"],"args":[[1],[2],[3],[],[]],"expected":[null,null,null,3,2],"note":"push 1,2,3 pop=3, peek=2"},{"ops":["push","pop","push","pop"],"args":[[5],[],[10],[]],"expected":[null,5,null,10],"note":"alternating push pop"},{"ops":["push","push","pop","pop"],"args":[[7],[8],[],[]],"expected":[null,null,8,7],"note":"LIFO order verified"},{"ops":["push","peek","pop","isEmpty"],"args":[[1],[],[],[]],"expected":[null,1,1,true],"note":"peek does not remove element"}]',
   'Queues are FIFO but stacks are LIFO. The trick: on every push, enqueue the new value into the empty q2, then drain all of q1 into q2. Now q2 has the new element at the front. Swap q1 and q2. Pop is now just a dequeue from q1.',
   'No size limit specified | Assume valid usage | push, pop, peek all required',
   'Time: O(n) per push, O(1) for pop/peek | Space: O(n)',
   'Op          | Args         | Returns
------------+--------------+----------
push        | (1)          | -
push        | (2)          | -
push        | (3)          | -
pop         | ()           | 3
peek        | ()           | 2

Other test cases:
  TC2: alternating push pop  =>  [5,10]
  TC3: LIFO order verified  =>  [8,7]
  TC4: peek does not remove element  =>  [1,1,true]'),

  ('sq_05',
   'Next greater element',
   'Use a monotonic decreasing stack. Pop elements when you find something larger than the top.',
   'hard',
   'Stack & Queue',
   'For each element, while the stack top is smaller than current, pop and record current as the answer.',
   'function nextGreater(arr) {
  // Step 1: create result array filled with -1
  // Step 2: create an empty stack (stores indices)
  // Step 3: for each element:
  //   while stack is not empty and arr[stack.top] < arr[i]
  //     pop and set result[popped] = arr[i]
  //   push i onto stack
  // Step 4: return result
}',
   '[{"input":[[4,5,2,10]],"expected":[5,10,10,-1]},{"input":[[3,2,1]],"expected":[-1,-1,-1]},{"input":[[1,3,2,4]],"expected":[3,4,4,-1]}]',
   'The monotonic stack keeps track of elements waiting for their "next greater" answer. When a new element is larger than the stack top, that new element is the answer for everything it beats. Remaining elements in the stack at the end have no greater element to their right  -  result is -1.',
   '1 <= arr.length <= 10^4 | Values can be any integer | Last element always has result -1',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: [4,5,2,10]  =>  [5,10,10,-1]
TC2: [3,2,1]  =>  [-1,-1,-1]
TC3: [1,3,2,4]  =>  [3,4,4,-1]

TC1 input:
  +---+---+---+----+
  | 4 | 5 | 2 | 10 |
  +---+---+---+----+
   0   1   2   3   
TC1 output:
  +---+----+----+----+
  | 5 | 10 | 10 | -1 |
  +---+----+----+----+
   0   1    2    3   '),

  ('sq_06',
   'Min stack with O(1) getMin',
   'Maintain a parallel min-tracker stack that records the current minimum at every push.',
   'hard',
   'Stack & Queue',
   'minStack.push(Math.min(val, minStack.peek())). Pop both stacks together.',
   'class MinStack {
  constructor() {
    this.stack = [];
    this.minStack = [];
  }
  push(val) {
    // push to stack
    // push min(val, current min) to minStack
  }
  pop() {
    // pop both stacks
  }
  getMin() {
    // return top of minStack
  }
}',
   '[{"ops":["push","push","push","getMin","pop","getMin"],"args":[[-2],[0],[-3],[],[],[]],"expected":[null,null,null,-3,null,-2],"note":"classic min stack example"},{"ops":["push","push","getMin","pop","getMin"],"args":[[5],[3],[],[],[]],"expected":[null,null,3,null,5],"note":"min updates correctly after pop"},{"ops":["push","getMin"],"args":[[42],[]],"expected":[null,42],"note":"single element min"},{"ops":["push","push","push","getMin"],"args":[[1],[2],[3],[]],"expected":[null,null,null,1],"note":"min stays at first when ascending"}]',
   'The challenge is that after a pop, you need to know the previous minimum. The trick: keep a second "min stack" that always records the running minimum at each level. When you push to the main stack, also push min(newVal, currentMin). Pop both together.',
   'Assume getMin and pop are never called on an empty stack | Values can be negative | No size limit',
   'Time: O(1) for all operations | Space: O(n)',
   'Op          | Args         | Returns
------------+--------------+----------
push        | (-2)         | -
push        | (0)          | -
push        | (-3)         | -
getMin      | ()           | -3
pop         | ()           | -
getMin      | ()           | -2

Other test cases:
  TC2: min updates correctly after pop  =>  [3,5]
  TC3: single element min  =>  [42]
  TC4: min stays at first when ascending  =>  [1]'),

  ('str_01',
   'Reverse a string',
   'Two-pointer swap from both ends toward the center.',
   'easy',
   'Strings',
   'Split into array, swap left and right, join back.',
   'function reverseString(s) {
  // Step 1: convert string to array
  // Step 2: two pointer swap
  // Step 3: join and return
}',
   '[{"input":["hello"],"expected":"olleh"},{"input":["abcde"],"expected":"edcba"},{"input":["a"],"expected":"a"}]',
   'Strings are immutable in most languages so convert to an array first. Then apply the same two-pointer swap technique used for reversing arrays. Join the result back into a string.',
   '1 <= s.length <= 10^5 | ASCII characters only | Single-character strings return unchanged',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: "hello"  =>  "olleh"
TC2: "abcde"  =>  "edcba"
TC3: "a"  =>  "a"

TC1:
  In:  "hello"
  Out: "olleh"'),

  ('str_02',
   'Check if palindrome',
   'Compare characters from both ends  -  stop early if any pair mismatches.',
   'easy',
   'Strings',
   'left pointer from 0, right from end. Return false if s[left] !== s[right].',
   'function isPalindrome(s) {
  // Step 1: set left = 0, right = s.length - 1
  // Step 2: while left < right
  //   if s[left] !== s[right] return false
  //   left++, right--
  // Step 3: return true
}',
   '[{"input":["racecar"],"expected":true},{"input":["hello"],"expected":false},{"input":["a"],"expected":true},{"input":["abba"],"expected":true}]',
   'A palindrome reads the same forwards and backwards. Check the outermost pair first, then move inward. If any pair doesn''t match, it is not a palindrome. If all pairs match and the pointers meet, it is.',
   '1 <= s.length <= 10^5 | Case-sensitive by default | Single characters are always palindromes',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: "racecar"  =>  true
TC2: "hello"  =>  false
TC3: "a"  =>  true
TC4: "abba"  =>  true

TC1:
  In:  "racecar"
  Out: true'),

  ('str_03',
   'Count vowels in a string',
   'Traverse each character and check membership in the vowel set.',
   'easy',
   'Strings',
   'Create a set of vowels. Loop and increment count whenever the character is in the set.',
   'function countVowels(s) {
  // Step 1: define vowel set: ''aeiouAEIOU''
  // Step 2: loop through each character
  // Step 3: if character is a vowel, increment count
  // Step 4: return count
}',
   '[{"input":["hello"],"expected":2},{"input":["aeiou"],"expected":5},{"input":["bcdfg"],"expected":0},{"input":[""],"expected":0}]',
   'A set lookup is O(1), making this approach efficient. Both uppercase and lowercase vowels should count unless the problem says otherwise. Empty strings return 0.',
   '0 <= s.length <= 10^5 | Both uppercase and lowercase vowels count | Empty string returns 0',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: "hello"  =>  2
TC2: "aeiou"  =>  5
TC3: "bcdfg"  =>  0
TC4: ""  =>  0

TC1:
  In:  "hello"
  Out: 2'),

  ('str_04',
   'Check if two strings are anagrams',
   'Count character frequencies for both strings, then compare the frequency maps.',
   'medium',
   'Strings',
   'Build a frequency object from s1. Decrement using s2. Check all values are zero.',
   'function isAnagram(s1, s2) {
  // Step 1: return false if lengths differ
  // Step 2: build frequency map for s1
  // Step 3: decrement frequency for each char in s2
  // Step 4: return true if all frequencies are 0
}',
   '[{"input":["anagram","nagaram"],"expected":true},{"input":["rat","car"],"expected":false},{"input":["a","a"],"expected":true},{"input":["ab","a"],"expected":false}]',
   'Two strings are anagrams if they use the same characters the same number of times. Count each character in the first string, then decrement for each character in the second. If any count goes negative or ends non-zero, they are not anagrams.',
   'Strings contain only lowercase English letters | Different lengths are immediately false | Empty strings are anagrams of each other',
   'Time: O(n) | Space: O(1) (at most 26 characters)',
   '--- All Test Cases ---
TC1: "anagram", "nagaram"  =>  true
TC2: "rat", "car"  =>  false
TC3: "a", "a"  =>  true
TC4: "ab", "a"  =>  false

TC1:
  In:  "anagram", "nagaram"
  Out: true'),

  ('str_05',
   'Find first non-repeating character',
   'Build a frequency map in one pass. Find the first character with frequency one in a second pass.',
   'medium',
   'Strings',
   'Two loops  -  first to count, second to find the first with count 1.',
   'function firstUnique(s) {
  // Step 1: build frequency map
  // Step 2: loop through string again
  //   return index of first char with freq === 1
  // Step 3: return -1 if none found
}',
   '[{"input":["leetcode"],"expected":0},{"input":["loveleetcode"],"expected":2},{"input":["aabb"],"expected":-1}]',
   'Two passes are needed: first count all character frequencies, then find the first one with count exactly 1 in order. Do not combine these  -  you need all counts before you can determine which is truly unique.',
   '1 <= s.length <= 10^5 | Lowercase English letters only | Return -1 if no unique character exists',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: "leetcode"  =>  0
TC2: "loveleetcode"  =>  2
TC3: "aabb"  =>  -1

TC1:
  In:  "leetcode"
  Out: 0'),

  ('str_06',
   'Longest substring without repeating characters',
   'Sliding window  -  use a set to track current window contents. Expand right, shrink left on duplicates.',
   'hard',
   'Strings',
   'When s[right] is already in the set, remove s[left] and advance left until it is gone.',
   'function lengthOfLongestSubstring(s) {
  // Step 1: set left = 0, best = 0, seen = new Set()
  // Step 2: loop right from 0 to s.length - 1
  //   while s[right] is in seen, delete s[left] and left++
  //   add s[right] to seen
  //   best = Math.max(best, right - left + 1)
  // Step 3: return best
}',
   '[{"input":["abcabcbb"],"expected":3},{"input":["bbbbb"],"expected":1},{"input":["pwwkew"],"expected":3},{"input":[""],"expected":0}]',
   'The sliding window grows to the right. If the new character already exists in the window, shrink from the left until it is gone. The window always contains unique characters. Track the maximum window size seen.',
   '0 <= s.length <= 5 * 10^4 | ASCII characters | Empty string returns 0',
   'Time: O(n) | Space: O(min(n, alphabet))',
   '--- All Test Cases ---
TC1: "abcabcbb"  =>  3
TC2: "bbbbb"  =>  1
TC3: "pwwkew"  =>  3
TC4: ""  =>  0

TC1:
  In:  "abcabcbb"
  Out: 3'),

  ('bs_01',
   'Classic binary search',
   'Find a target in a sorted array by halving the search space each step.',
   'easy',
   'Binary Search',
   'mid = Math.floor((low + high) / 2). Adjust low or high based on comparison.',
   'function binarySearch(arr, target) {
  // Step 1: set low = 0, high = arr.length - 1
  // Step 2: while low <= high
  //   mid = Math.floor((low + high) / 2)
  //   if arr[mid] === target return mid
  //   if arr[mid] < target, low = mid + 1
  //   else high = mid - 1
  // Step 3: return -1
}',
   '[{"input":[[-1,0,3,5,9,12],9],"expected":4},{"input":[[-1,0,3,5,9,12],2],"expected":-1},{"input":[[5],5],"expected":0}]',
   'Binary search works only on sorted arrays. Each comparison eliminates half the remaining elements. If arr[mid] is too small, everything to the left is also too small  -  so move low up. If too large, move high down. Much faster than a linear scan.',
   'Array must be sorted in ascending order | 1 <= arr.length <= 10^4 | Return -1 if not found',
   'Time: O(log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [-1,0,3,5,9,12], 9  =>  4
TC2: [-1,0,3,5,9,12], 2  =>  -1
TC3: [5], 5  =>  0

TC1 input:
  +----+---+---+---+---+----+
  | -1 | 0 | 3 | 5 | 9 | 12 |
  +----+---+---+---+---+----+
   0    1   2   3   4   5   
  arg2: 9
TC1 output:
  4'),

  ('bs_02',
   'Find insert position',
   'Return the index where the target should be inserted to keep the array sorted.',
   'easy',
   'Binary Search',
   'When the loop ends, low is the correct insert position.',
   'function searchInsert(arr, target) {
  // Step 1: standard binary search setup
  // Step 2: run binary search
  // Step 3: return low (the insert position) when loop ends
}',
   '[{"input":[[1,3,5,6],5],"expected":2},{"input":[[1,3,5,6],2],"expected":1},{"input":[[1,3,5,6],7],"expected":4},{"input":[[1,3,5,6],0],"expected":0}]',
   'A standard binary search that returns the insertion index when the target is not found. When the loop exits, low has "narrowed down" to the exact spot where the target would go. This works because low always points to the smallest element >= target.',
   '1 <= arr.length <= 10^4 | Array has distinct integers sorted ascending | 0-indexed result',
   'Time: O(log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1,3,5,6], 5  =>  2
TC2: [1,3,5,6], 2  =>  1
TC3: [1,3,5,6], 7  =>  4
TC4: [1,3,5,6], 0  =>  0

TC1 input:
  +---+---+---+---+
  | 1 | 3 | 5 | 6 |
  +---+---+---+---+
   0   1   2   3  
  arg2: 5
TC1 output:
  2'),

  ('bs_03',
   'First and last position of target',
   'Run binary search twice  -  once biased left to find first, once biased right to find last.',
   'medium',
   'Binary Search',
   'For first: when arr[mid] === target, save mid but continue searching left (high = mid - 1).',
   'function firstAndLast(arr, target) {
  // Step 1: write findFirst(arr, target)  -  binary search that saves result and goes left on match
  // Step 2: write findLast(arr, target)  -  binary search that saves result and goes right on match
  // Step 3: return [findFirst, findLast]
}',
   '[{"input":[[5,7,7,8,8,10],8],"expected":[3,4]},{"input":[[5,7,7,8,8,10],6],"expected":[-1,-1]},{"input":[[],0],"expected":[-1,-1]}]',
   'A single binary search finds one occurrence. To find both ends, run it twice. For the first position, when you find a match keep searching left (high = mid - 1). For the last position, keep searching right (low = mid + 1). Return [-1, -1] if not found.',
   '0 <= arr.length <= 10^5 | Array is sorted | Target may not exist  -  return [-1, -1]',
   'Time: O(log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [5,7,7,8,8,10], 8  =>  [3,4]
TC2: [5,7,7,8,8,10], 6  =>  [-1,-1]
TC3: [], 0  =>  [-1,-1]

TC1 input:
  +---+---+---+---+---+----+
  | 5 | 7 | 7 | 8 | 8 | 10 |
  +---+---+---+---+---+----+
   0   1   2   3   4   5   
  arg2: 8
TC1 output:
  +---+---+
  | 3 | 4 |
  +---+---+
   0   1  '),

  ('bs_04',
   'Search in rotated sorted array',
   'At each mid, determine which half is sorted, then decide which side the target is on.',
   'medium',
   'Binary Search',
   'If arr[low] <= arr[mid], the left half is sorted. Check if target falls within it.',
   'function searchRotated(arr, target) {
  // Step 1: set low = 0, high = arr.length - 1
  // Step 2: while low <= high compute mid
  //   if arr[mid] === target return mid
  //   determine which half is sorted
  //   check if target is in that sorted half
  //   adjust low or high accordingly
  // Step 3: return -1
}',
   '[{"input":[[4,5,6,7,0,1,2],0],"expected":4},{"input":[[4,5,6,7,0,1,2],3],"expected":-1},{"input":[[1],0],"expected":-1}]',
   'Even after rotation, one half is always fully sorted. Use this to determine which half the target could be in. If the left half is sorted and the target is within its range, search left. Otherwise search right.',
   '1 <= arr.length <= 5000 | All values are unique | Array was sorted then rotated at some pivot',
   'Time: O(log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [4,5,6,7,0,1,2], 0  =>  4
TC2: [4,5,6,7,0,1,2], 3  =>  -1
TC3: [1], 0  =>  -1

TC1 input:
  +---+---+---+---+---+---+---+
  | 4 | 5 | 6 | 7 | 0 | 1 | 2 |
  +---+---+---+---+---+---+---+
   0   1   2   3   4   5   6  
  arg2: 0
TC1 output:
  4'),

  ('bs_05',
   'Find minimum in rotated array',
   'The minimum is always in the unsorted half. Use that property to narrow down.',
   'hard',
   'Binary Search',
   'If arr[mid] > arr[high], the minimum is in the right half. Otherwise it is in the left.',
   'function findMin(arr) {
  // Step 1: set low = 0, high = arr.length - 1
  // Step 2: while low < high
  //   mid = Math.floor((low + high) / 2)
  //   if arr[mid] > arr[high], low = mid + 1
  //   else high = mid
  // Step 3: return arr[low]
}',
   '[{"input":[[3,4,5,1,2]],"expected":1},{"input":[[4,5,6,7,0,1,2]],"expected":0},{"input":[[11,13,15,17]],"expected":11}]',
   'The minimum sits at the rotation point. If arr[mid] > arr[high], the minimum must be to the right of mid (the right half contains the wrap-around). Otherwise the minimum is at mid or to its left.',
   '1 <= arr.length <= 5000 | All values are unique | May not be rotated  -  handle that case',
   'Time: O(log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [3,4,5,1,2]  =>  1
TC2: [4,5,6,7,0,1,2]  =>  0
TC3: [11,13,15,17]  =>  11

TC1 input:
  +---+---+---+---+---+
  | 3 | 4 | 5 | 1 | 2 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  1'),

  ('rec_01',
   'Factorial',
   'Base case is n === 0 returns 1. Recursive case multiplies n by factorial(n-1).',
   'easy',
   'Recursion',
   'if (n === 0) return 1; return n * factorial(n - 1);',
   'function factorial(n) {
  // Base case: what is the smallest input?
  // Recursive case: how does n relate to n-1?
}',
   '[{"input":[5],"expected":120},{"input":[0],"expected":1},{"input":[1],"expected":1},{"input":[6],"expected":720}]',
   'Factorial(n) = n * (n-1) * (n-2) * ... * 1. The recursive version trusts that factorial(n-1) is already solved and just multiplies n by it. The base case n=0 returns 1 (by definition). This is the simplest example of "trust the recursion".',
   '0 <= n <= 12 (beyond this, the result exceeds safe integer range) | factorial(0) = 1 by definition',
   'Time: O(n) | Space: O(n) call stack',
   '--- All Test Cases ---
TC1: 5  =>  120
TC2: 0  =>  1
TC3: 1  =>  1
TC4: 6  =>  720

TC1:
  In:  5
  Out: 120'),

  ('rec_02',
   'Fibonacci number',
   'Base cases are fib(0) = 0 and fib(1) = 1. Return fib(n-1) + fib(n-2).',
   'easy',
   'Recursion',
   'Watch how the call stack grows  -  this is the key insight of this problem.',
   'function fib(n) {
  // Base cases: n === 0 and n === 1
  // Recursive case: sum of previous two
}',
   '[{"input":[0],"expected":0},{"input":[1],"expected":1},{"input":[6],"expected":8},{"input":[10],"expected":55}]',
   'The Fibonacci sequence: each number is the sum of the two before it. The naive recursive version has overlapping subproblems (fib(3) is computed multiple times), which makes it O(2^n). This problem is a great motivator for memoization.',
   '0 <= n <= 30 for plain recursion | Values: fib(0)=0, fib(1)=1 | Naive recursion is exponential  -  acceptable here',
   'Time: O(2^n) naive | Space: O(n) call stack',
   '--- All Test Cases ---
TC1: 0  =>  0
TC2: 1  =>  1
TC3: 6  =>  8
TC4: 10  =>  55

TC1:
  In:  0
  Out: 0'),

  ('rec_03',
   'Power function',
   'If exponent is even, square the base and halve the exponent. Handles odd with one extra multiply.',
   'medium',
   'Recursion',
   'pow(x, n) = pow(x*x, n/2) when n is even. pow(x, n) = x * pow(x, n-1) when odd.',
   'function power(x, n) {
  // Base case: n === 0 returns 1
  // If n is even: return power(x * x, n / 2)
  // If n is odd: return x * power(x, n - 1)
}',
   '[{"input":[2,10],"expected":1024},{"input":[2,0],"expected":1},{"input":[3,3],"expected":27},{"input":[5,2],"expected":25}]',
   'Fast exponentiation: instead of multiplying x by itself n times (slow), halve the exponent each time by squaring the base. 2^10 becomes (2^2)^5, then (4^2)^2 * 4... This cuts the number of steps from n to log(n).',
   '0 <= n <= 30 | x can be any real number | x^0 = 1 always',
   'Time: O(log n) | Space: O(log n) call stack',
   '--- All Test Cases ---
TC1: 2, 10  =>  1024
TC2: 2, 0  =>  1
TC3: 3, 3  =>  27
TC4: 5, 2  =>  25

TC1:
  In:  2, 10
  Out: 1024'),

  ('rec_04',
   'Flatten a nested array',
   'Recurse into each element  -  if it is an array, flatten it. Otherwise push it to result.',
   'medium',
   'Recursion',
   'Check Array.isArray(item). If yes, recurse. If no, push to result.',
   'function flatten(arr) {
  const result = [];
  // For each item in arr:
  //   if item is an array, spread flatten(item) into result
  //   else push item into result
  return result;
}',
   '[{"input":[[1,[2,[3,[4]]]]],"expected":[1,2,3,4]},{"input":[[1,2,3]],"expected":[1,2,3]},{"input":[[1,[2,3],[4,[5]]]],"expected":[1,2,3,4,5]}]',
   'Recursion is natural here: if you see an array, flatten it. If you see a value, collect it. The recursion handles arbitrary nesting depth. Think of it as peeling layers of an onion.',
   'Nesting can be arbitrarily deep | Values can be any type | Already-flat arrays return unchanged',
   'Time: O(n) where n = total elements | Space: O(d) where d = max nesting depth',
   '--- All Test Cases ---
TC1: [1,[2,[3,[4]]]]  =>  [1,2,3,4]
TC2: [1,2,3]  =>  [1,2,3]
TC3: [1,[2,3],[4,[5]]]  =>  [1,2,3,4,5]

TC1 input:
  +---+-------+
  | 1 | 2,3,4 |
  +---+-------+
   0   1      
TC1 output:
  +---+---+---+---+
  | 1 | 2 | 3 | 4 |
  +---+---+---+---+
   0   1   2   3  '),

  ('rec_05',
   'Tower of Hanoi',
   'Move n-1 disks to helper, move the large disk to target, move n-1 disks from helper to target.',
   'hard',
   'Recursion',
   'hanoi(n-1, from, via, to) then move disk, then hanoi(n-1, via, to, from).',
   'function hanoi(n, from, to, via) {
  // Base case: n === 0, do nothing
  // Step 1: move n-1 disks from ''from'' to ''via'' using ''to''
  // Step 2: move the nth disk from ''from'' to ''to''
  // Step 3: move n-1 disks from ''via'' to ''to'' using ''from''
  console.log(`Move disk ${n} from ${from} to ${to}`);
}',
   '[{"input":[1,"A","C","B"],"expected":1,"note":"1 disk = 1 move"},{"input":[2,"A","C","B"],"expected":3,"note":"2 disks = 3 moves"},{"input":[3,"A","C","B"],"expected":7,"note":"3 disks = 7 moves"},{"input":[4,"A","C","B"],"expected":15,"note":"4 disks = 15 moves"}]',
   'Trust the recursion completely. Assume you can already solve the problem for n-1 disks. To move n disks from A to C: use C as helper to move n-1 to B, move the big disk to C, then use A as helper to move n-1 from B to C. Total moves = 2^n - 1.',
   '1 <= n <= 20 | Three pegs: from, to, via | Never place larger disk on smaller | Minimum moves = 2^n - 1',
   'Time: O(2^n) | Space: O(n) call stack',
   '--- All Test Cases ---
TC1: 1, "A", "C", "B"  =>  1
TC2: 2, "A", "C", "B"  =>  3
TC3: 3, "A", "C", "B"  =>  7
TC4: 4, "A", "C", "B"  =>  15

TC1:
  In:  1, "A", "C", "B"
  Out: 1'),

  ('rec_06',
   'Generate all subsets',
   'At each step, choose to include or exclude the current element. Two recursive branches each call.',
   'hard',
   'Recursion',
   'subsets(index + 1, [...current, arr[index]]) and subsets(index + 1, current).',
   'function subsets(arr) {
  const result = [];
  function generate(index, current) {
    // Base case: index === arr.length, push current copy to result
    // Include arr[index]: recurse with it added
    // Exclude arr[index]: recurse without it
  }
  generate(0, []);
  return result;
}',
   '[{"input":[[1,2,3]],"expected":[[],[3],[2],[2,3],[1],[1,3],[1,2],[1,2,3]]},{"input":[[1]],"expected":[[],[1]]}]',
   'For each element, you make a binary choice: include it or not. This creates a binary tree of decisions. The leaves of the tree are all 2^n subsets. An array of n elements has 2^n subsets including the empty set.',
   '1 <= arr.length <= 10 | All elements are distinct | Result includes the empty set | Order of subsets may vary',
   'Time: O(2^n) | Space: O(n) recursion depth',
   '--- All Test Cases ---
TC1: [1,2,3]  =>  [[],[3],[2],[2,3],[1],[1,3],[1,2],[1,2,3]]
TC2: [1]  =>  [[],[1]]

TC1 input:
  +---+---+---+
  | 1 | 2 | 3 |
  +---+---+---+
   0   1   2  
TC1 output:
  +--+---+---+-----+---+-----+-----+-------+
  |  | 3 | 2 | 2,3 | 1 | 1,3 | 1,2 | 1,2,3 |
  +--+---+---+-----+---+-----+-----+-------+
   0  1   2   3     4   5     6     7      '),

  ('bt_01',
   'Generate all permutations',
   'Swap each element into the current position and recurse. Backtrack by swapping back.',
   'medium',
   'Backtracking',
   'Swap arr[start] with arr[i], recurse with start + 1, then swap back.',
   'function permutations(arr) {
  const result = [];
  function permute(start) {
    // Base case: start === arr.length, push copy of arr
    // For i from start to arr.length - 1:
    //   swap arr[start] and arr[i]
    //   permute(start + 1)
    //   swap back to backtrack
  }
  permute(0);
  return result;
}',
   '[{"input":[[1,2,3]],"expected":[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,2,1],[3,1,2]]},{"input":[[1]],"expected":[[1]]}]',
   'To generate all orderings, fix one element at each position and permute the rest. The swap-and-recurse-then-swap-back pattern "tries" each element at the current position without permanently changing the array.',
   '1 <= arr.length <= 8 | Elements are distinct | n! permutations total',
   'Time: O(n * n!) | Space: O(n)',
   '--- All Test Cases ---
TC1: [1,2,3]  =>  [[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,2,1],[3,1,2]]
TC2: [1]  =>  [[1]]

TC1 input:
  +---+---+---+
  | 1 | 2 | 3 |
  +---+---+---+
   0   1   2  
TC1 output:
  +-------+-------+-------+-------+-------+-------+
  | 1,2,3 | 1,3,2 | 2,1,3 | 2,3,1 | 3,2,1 | 3,1,2 |
  +-------+-------+-------+-------+-------+-------+
   0       1       2       3       4       5      '),

  ('bt_02',
   'Generate all combinations of size k',
   'Pick elements one by one from start index onwards. Stop when combination size equals k.',
   'medium',
   'Backtracking',
   'Prune early: if remaining elements are not enough to fill k slots, stop.',
   'function combinations(arr, k) {
  const result = [];
  function combine(start, current) {
    // Base case: current.length === k, push copy
    // For i from start to arr.length - 1:
    //   push arr[i] to current
    //   recurse with i + 1
    //   pop to backtrack
  }
  combine(0, []);
  return result;
}',
   '[{"input":[[1,2,3,4],2],"expected":[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]},{"input":[[1,2],1],"expected":[[1],[2]]}]',
   'Build combinations by always picking the next element from an index after the last pick. This avoids duplicates naturally. The early pruning trick: if there are fewer remaining elements than slots left to fill, stop  -  you can never complete k elements.',
   '1 <= k <= arr.length <= 10 | Elements are distinct | Order within a combination does not matter',
   'Time: O(C(n,k) * k) | Space: O(k)',
   '--- All Test Cases ---
TC1: [1,2,3,4], 2  =>  [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
TC2: [1,2], 1  =>  [[1],[2]]

TC1 input:
  +---+---+---+---+
  | 1 | 2 | 3 | 4 |
  +---+---+---+---+
   0   1   2   3  
  arg2: 2
TC1 output:
  +-----+-----+-----+-----+-----+-----+
  | 1,2 | 1,3 | 1,4 | 2,3 | 2,4 | 3,4 |
  +-----+-----+-----+-----+-----+-----+
   0     1     2     3     4     5    '),

  ('bt_03',
   'Solve a maze',
   'Try all four directions from current cell. Mark visited, recurse, unmark on backtrack.',
   'medium',
   'Backtracking',
   'Directions: up, down, left, right. Check bounds and visited before each move.',
   'function solveMaze(maze) {
  const path = [];
  const visited = Array.from({length: maze.length}, () => new Array(maze[0].length).fill(false));
  function dfs(row, col) {
    // Base case: reached exit (bottom-right cell), return true
    // Check bounds, wall, visited  -  return false if invalid
    // Mark visited, push to path
    // Try all 4 directions
    // If no direction worked, pop from path, unmark visited, return false
  }
  dfs(0, 0);
  return path;
}',
   '[{"input":[[[0,0,1],[0,0,0],[1,0,0]]],"expected":[[0,0],[1,0],[1,1],[1,2],[2,2]],"note":"standard 3x3 maze"},{"input":[[[0,0],[0,0]]],"expected":[[0,0],[1,0],[1,1]],"note":"2x2 open maze"},{"input":[[[0,1],[0,0]]],"expected":[[0,0],[1,0],[1,1]],"note":"blocked top-right path"},{"input":[[[0]]],"expected":[[0,0]],"note":"1x1 maze, start is exit"}]',
   'Explore every possible path. When you hit a dead end (wall, out of bounds, already visited), backtrack  -  undo the last move and try a different direction. The key insight: marking a cell visited prevents infinite loops, and unmarking on backtrack allows other paths to use it.',
   '0 = open cell, 1 = wall | Start is top-left [0,0], exit is bottom-right | Grid is at least 1x1',
   'Time: O(4^(rows*cols)) worst case | Space: O(rows*cols)',
   '--- All Test Cases ---
TC1: [[0,0,1],[0,0,0],[1,0,0]]  =>  [[0,0],[1,0],[1,1],[1,2],[2,2]]
TC2: [[0,0],[0,0]]  =>  [[0,0],[1,0],[1,1]]
TC3: [[0,1],[0,0]]  =>  [[0,0],[1,0],[1,1]]
TC4: [[0]]  =>  [[0,0]]

TC1 input:
  +-------+-------+-------+
  | 0,0,1 | 0,0,0 | 1,0,0 |
  +-------+-------+-------+
   0       1       2      
TC1 output:
  +-----+-----+-----+-----+-----+
  | 0,0 | 1,0 | 1,1 | 1,2 | 2,2 |
  +-----+-----+-----+-----+-----+
   0     1     2     3     4    '),

  ('bt_04',
   'N-Queens problem',
   'Place one queen per row. Check column and diagonal conflicts before placing. Backtrack on conflict.',
   'hard',
   'Backtracking',
   'Track occupied columns and diagonals using sets. Use row - col and row + col as diagonal keys.',
   'function nQueens(n) {
  const results = [];
  const cols = new Set(), diag1 = new Set(), diag2 = new Set();
  const board = Array.from({length: n}, () => new Array(n).fill(''.''));
  function place(row) {
    // Base case: row === n, push board copy to results
    // For each col in row:
    //   if col or diagonals are occupied, skip
    //   place queen, add to sets
    //   recurse to next row
    //   remove queen, remove from sets (backtrack)
  }
  place(0);
  return results;
}',
   '[{"input":[4],"expected":2},{"input":[1],"expected":1}]',
   'Place one queen per row, ensuring no two queens share a column or diagonal. Three sets track which columns and two diagonal directions are occupied. The diagonal trick: all cells on the same "/" diagonal share the same (row+col) value; all on the same "\\\\" diagonal share (row-col).',
   '1 <= n <= 9 | One queen per row is guaranteed by the algorithm structure | Return count of solutions',
   'Time: O(n!) | Space: O(n)',
   '--- All Test Cases ---
TC1: 4  =>  2
TC2: 1  =>  1

TC1:
  In:  4
  Out: 2'),

  ('gr_01',
   'Coin change  -  greedy with canonical coins',
   'Always pick the largest denomination coin that fits. Works for standard coin systems.',
   'easy',
   'Greedy',
   'Sort coins descending. For each coin, use as many as possible before moving to the next.',
   'function coinChangeGreedy(coins, amount) {
  // Step 1: sort coins descending
  // Step 2: for each coin, use Math.floor(amount / coin) times
  //   subtract from amount, add to count
  // Step 3: return count (or -1 if amount is not zero)
}',
   '[{"input":[[25,10,5,1],36],"expected":3},{"input":[[25,10,5,1],11],"expected":2},{"input":[[1],5],"expected":5}]',
   'Greedy works here because standard coin systems (like US coins) are "canonical"  -  always taking the largest coin leads to the optimal solution. This does NOT work for arbitrary coin sets (use dynamic programming for that).',
   'Coins are standard denominations | Amount >= 0 | Greedy may fail for non-canonical coin sets',
   'Time: O(n log n + amount/min_coin) | Space: O(1)',
   '--- All Test Cases ---
TC1: [25,10,5,1], 36  =>  3
TC2: [25,10,5,1], 11  =>  2
TC3: [1], 5  =>  5

TC1 input:
  +----+----+---+---+
  | 25 | 10 | 5 | 1 |
  +----+----+---+---+
   0    1    2   3  
  arg2: 36
TC1 output:
  3'),

  ('gr_02',
   'Activity selection problem',
   'Sort activities by finish time. Always pick the next activity that starts after the last one ends.',
   'medium',
   'Greedy',
   'Sort by endTime. Track lastEnd. Include activity if startTime >= lastEnd.',
   'function activitySelection(activities) {
  // Step 1: sort activities by end time
  // Step 2: set count = 1, lastEnd = activities[0].end
  // Step 3: for each remaining activity
  //   if activity.start >= lastEnd, select it, update lastEnd, count++
  // Step 4: return count
}',
   '[{"input":[[[1,3],[2,5],[3,9],[6,8]]],"expected":3},{"input":[[[1,2],[2,3],[3,4]]],"expected":3}]',
   'The greedy choice: always pick the activity that finishes earliest among those that don''t overlap with the last selected. Finishing early leaves maximum room for future activities. Sorting by end time makes this a simple linear scan after sorting.',
   'Activities given as [start, end] pairs | start < end | Activities may overlap | Maximize number of non-overlapping activities',
   'Time: O(n log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [[1,3],[2,5],[3,9],[6,8]]  =>  3
TC2: [[1,2],[2,3],[3,4]]  =>  3

TC1 input:
  +-----+-----+-----+-----+
  | 1,3 | 2,5 | 3,9 | 6,8 |
  +-----+-----+-----+-----+
   0     1     2     3    
TC1 output:
  3'),

  ('gr_03',
   'Jump game  -  can you reach the end?',
   'Track the farthest index reachable. If the current index ever exceeds it, you are stuck.',
   'medium',
   'Greedy',
   'maxReach = Math.max(maxReach, i + nums[i]). If i > maxReach, return false.',
   'function canJump(nums) {
  // Step 1: set maxReach = 0
  // Step 2: for each index i
  //   if i > maxReach return false
  //   maxReach = Math.max(maxReach, i + nums[i])
  // Step 3: return true
}',
   '[{"input":[[2,3,1,1,4]],"expected":true},{"input":[[3,2,1,0,4]],"expected":false},{"input":[[0]],"expected":true}]',
   'At each position, track the farthest index you can possibly reach. If you ever find yourself at an index beyond your current reach, you are stuck. This greedy approach works because you only need to know the maximum reachable index at each step.',
   '1 <= nums.length <= 10^4 | 0 <= nums[i] <= 10^5 | Single-element array always returns true',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [2,3,1,1,4]  =>  true
TC2: [3,2,1,0,4]  =>  false
TC3: [0]  =>  true

TC1 input:
  +---+---+---+---+---+
  | 2 | 3 | 1 | 1 | 4 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  true'),

  ('gr_04',
   'Minimum platforms needed',
   'Sort arrivals and departures separately. Count overlapping trains at any point.',
   'easy',
   'Greedy',
   'Two pointer approach  -  if arrival[i] <= departure[j], a new platform is needed.',
   'function minPlatforms(arrivals, departures) {
  // Step 1: sort both arrays
  // Step 2: set platforms = 1, maxPlatforms = 1, i = 1, j = 0
  // Step 3: while i < n and j < n
  //   if arrivals[i] <= departures[j], platforms++, i++
  //   else platforms--, j++
  //   update maxPlatforms
  // Step 4: return maxPlatforms
}',
   '[{"input":[[900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000]],"expected":3,"note":"classic example"},{"input":[[900,1000],[910,1200]],"expected":2,"note":"both overlap"},{"input":[[900,1000],[1001,1200]],"expected":1,"note":"no overlap, sequential"},{"input":[[900],[1000]],"expected":1,"note":"single train"}]',
   'Sort both arrays. Use two pointers: if the next train arrives before the earliest departure, you need a new platform. Otherwise a train has left and a platform is freed. Track the peak platform count.',
   'arrivals and departures arrays are same length | Times are in HHMM format | At least one train',
   'Time: O(n log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [900,940,950,1100,1500,1800], [910,1200,1120,1130,1900,2000]  =>  3
TC2: [900,1000], [910,1200]  =>  2
TC3: [900,1000], [1001,1200]  =>  1
TC4: [900], [1000]  =>  1

TC1 input:
  +-----+-----+-----+------+------+------+
  | 900 | 940 | 950 | 1100 | 1500 | 1800 |
  +-----+-----+-----+------+------+------+
   0     1     2     3      4      5     
  arg2: [910,1200,1120,1130,1900,2000]
TC1 output:
  3'),

  ('hp_01',
   'Find kth largest element',
   'Build a min-heap of size k. For each new element, if larger than heap top, replace it.',
   'easy',
   'Heaps',
   'Simulate a min-heap using a sorted array for simplicity. The kth largest is the smallest in the heap.',
   'function kthLargest(arr, k) {
  // Simulate min-heap with a sorted array of size k
  // Step 1: fill heap with first k elements and sort
  // Step 2: for remaining elements
  //   if element > heap[0], replace heap[0] and re-sort
  // Step 3: return heap[0]
}',
   '[{"input":[[3,2,1,5,6,4],2],"expected":5},{"input":[[3,2,3,1,2,4,5,5,6],4],"expected":4}]',
   'A min-heap of size k always holds the k largest elements seen so far. The minimum of those k elements is the kth largest overall. When a new element beats the current minimum, it replaces it.',
   '1 <= k <= arr.length <= 10^4 | Values can be negative',
   'Time: O(n log k) | Space: O(k)',
   '--- All Test Cases ---
TC1: [3,2,1,5,6,4], 2  =>  5
TC2: [3,2,3,1,2,4,5,5,6], 4  =>  4

TC1 input:
  +---+---+---+---+---+---+
  | 3 | 2 | 1 | 5 | 6 | 4 |
  +---+---+---+---+---+---+
   0   1   2   3   4   5  
  arg2: 2
TC1 output:
  5'),

  ('hp_02',
   'Merge k sorted arrays',
   'Push the first element of each array into a min-heap. Pop the minimum and push the next from that array.',
   'medium',
   'Heaps',
   'Each heap entry stores {value, arrayIndex, elementIndex} so you know where to pull the next element.',
   'function mergeKSorted(arrays) {
  const result = [];
  // Simulate min-heap: store [value, arrIdx, elemIdx]
  // Step 1: push first element of each array
  // Step 2: while heap is not empty
  //   pop minimum
  //   push to result
  //   if next element exists in same array, push it
  return result;
}',
   '[{"input":[[[1,4,7],[2,5,8],[3,6,9]]],"expected":[1,2,3,4,5,6,7,8,9]},{"input":[[[1],[2],[3]]],"expected":[1,2,3]}]',
   'Think of the heap as a "smart selection": at any moment it holds exactly k candidates (the current front of each array). Popping the minimum and pushing the next element from that array keeps the heap small while always giving you the globally smallest remaining element.',
   'k >= 1 | Each array is sorted | Arrays can have different lengths | Any array can be empty',
   'Time: O(n log k) where n = total elements | Space: O(k)',
   '--- All Test Cases ---
TC1: [[1,4,7],[2,5,8],[3,6,9]]  =>  [1,2,3,4,5,6,7,8,9]
TC2: [[1],[2],[3]]  =>  [1,2,3]

TC1 input:
  +-------+-------+-------+
  | 1,4,7 | 2,5,8 | 3,6,9 |
  +-------+-------+-------+
   0       1       2      
TC1 output:
  +---+---+---+---+---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
  +---+---+---+---+---+---+---+---+---+
   0   1   2   3   4   5   6   7   8  '),

  ('hp_03',
   'Top k frequent elements',
   'Count frequencies with a map. Use a min-heap of size k to track the top entries.',
   'medium',
   'Heaps',
   'Build a frequency map first. Then simulate a min-heap over frequencies.',
   'function topKFrequent(arr, k) {
  // Step 1: build frequency map
  // Step 2: convert map to array of [element, count] pairs
  // Step 3: sort by count descending
  // Step 4: return first k elements
}',
   '[{"input":[[1,1,1,2,2,3],2],"expected":[1,2]},{"input":[[1],1],"expected":[1]}]',
   'Two steps: count, then rank. The frequency map gives you counts in O(n). Sorting or using a min-heap of size k gives you the top k. The simplified sort approach is O(n log n) but easier to implement correctly.',
   '1 <= k <= number of unique elements | 1 <= arr.length <= 10^4 | Answer is always unique',
   'Time: O(n log k) with heap, O(n log n) with sort | Space: O(n)',
   '--- All Test Cases ---
TC1: [1,1,1,2,2,3], 2  =>  [1,2]
TC2: [1], 1  =>  [1]

TC1 input:
  +---+---+---+---+---+---+
  | 1 | 1 | 1 | 2 | 2 | 3 |
  +---+---+---+---+---+---+
   0   1   2   3   4   5  
  arg2: 2
TC1 output:
  +---+---+
  | 1 | 2 |
  +---+---+
   0   1  '),

  ('hp_04',
   'Median from a data stream',
   'Maintain a max-heap for the lower half and a min-heap for the upper half. Balance after each insert.',
   'hard',
   'Heaps',
   'lo is a max-heap (negate values to simulate). hi is a min-heap. Keep sizes equal or lo one larger.',
   'class MedianFinder {
  constructor() {
    this.lo = []; // max-heap (simulated by negating values)
    this.hi = []; // min-heap
  }
  addNum(num) {
    // Add to lo, balance sizes
    // If lo.top > hi.top, move lo.top to hi
    // Balance so lo.length >= hi.length
  }
  findMedian() {
    // If equal size: average of both tops
    // Otherwise: top of lo
  }
}',
   '[{"ops":["addNum","addNum","findMedian","addNum","findMedian"],"args":[[1],[2],[],[3],[]],"expected":[null,null,1.5,null,2],"note":"basic median stream"},{"ops":["addNum","findMedian"],"args":[[1],[]],"expected":[null,1],"note":"single element median"},{"ops":["addNum","addNum","findMedian"],"args":[[2],[3],[]],"expected":[null,null,2.5],"note":"two elements median"},{"ops":["addNum","addNum","addNum","addNum","findMedian"],"args":[[5],[3],[8],[4],[]],"expected":[null,null,null,null,4.5],"note":"four elements median"}]',
   'Split numbers into two halves: lo holds the smaller half (max-heap), hi holds the larger half (min-heap). The tops of these two heaps are always the middle values. Balance sizes so they differ by at most 1 after each insert.',
   'Values can be any integer | Stream has at least 1 number before findMedian is called | Median is a float when even count',
   'Time: O(log n) per addNum, O(1) per findMedian | Space: O(n)',
   'Op          | Args         | Returns
------------+--------------+----------
addNum      | (1)          | -
addNum      | (2)          | -
findMedian  | ()           | 1.5
addNum      | (3)          | -
findMedian  | ()           | 2

Other test cases:
  TC2: single element median  =>  [1]
  TC3: two elements median  =>  [2.5]
  TC4: four elements median  =>  [4.5]'),

  ('hp_05',
   'Reorganize string',
   'Use a max-heap by frequency. Always place the most frequent unused character next.',
   'hard',
   'Heaps',
   'After placing a character, hold it out for one step before re-inserting so it is not placed twice in a row.',
   'function reorganizeString(s) {
  // Step 1: build frequency map
  // Step 2: simulate max-heap (sort by frequency)
  // Step 3: while heap is not empty
  //   pop most frequent, append to result
  //   re-insert previous character if its count > 0
  // Step 4: return result or '''' if impossible
}',
   '[{"input":["aab"],"expected":"aba"},{"input":["aaab"],"expected":""},{"input":["aabb"],"expected":"abab"}]',
   'Greedily place the most frequent character, but never the same one twice in a row. The trick: after placing a character, hold it back for one turn, then re-insert it. If any character''s frequency exceeds (n+1)/2, it is impossible.',
   '1 <= s.length <= 500 | Lowercase English letters only | Return empty string if impossible',
   'Time: O(n log k) where k = unique chars | Space: O(k)',
   '--- All Test Cases ---
TC1: "aab"  =>  "aba"
TC2: "aaab"  =>  ""
TC3: "aabb"  =>  "abab"

TC1:
  In:  "aab"
  Out: "aba"'),

  ('btr_01',
   'Inorder traversal',
   'Recurse left, visit node, recurse right. Classic left-root-right order.',
   'easy',
   'Binary Tree',
   'inorder(node.left), push node.val, inorder(node.right).',
   'function inorder(root) {
  const result = [];
  function traverse(node) {
    // Base case: node is null, return
    // Recurse left
    // Push node.val
    // Recurse right
  }
  traverse(root);
  return result;
}',
   '[{"input":[[1,null,2,3]],"expected":[1,3,2]},{"input":[null],"expected":[]},{"input":[[1]],"expected":[1]}]',
   'Inorder means Left -> Root -> Right. For a Binary Search Tree, inorder traversal gives values in sorted order  -  that''s one of its key properties. Recursion naturally handles the tree structure.',
   'Tree can be null (return empty array) | No size limit specified | Node values can be any integer',
   'Time: O(n) | Space: O(h) where h = tree height',
   '--- All Test Cases ---
TC1: [1,N,2,3]  =>  [1,3,2]
TC2: null  =>  []
TC3: [1]  =>  [1]

TC1 tree (level-order input):
         1
        / \\
       N   2
      / \\ / \\
     3  .  .  .
  Out: [1,3,2]'),

  ('btr_02',
   'Find height of tree',
   'Height is 1 plus the maximum of left and right subtree heights. Base case: null returns 0.',
   'easy',
   'Binary Tree',
   'return 1 + Math.max(height(node.left), height(node.right)).',
   'function height(root) {
  // Base case: root is null, return 0
  // Recursive case: 1 + max of left and right heights
}',
   '[{"input":[[3,9,20,null,null,15,7]],"expected":3},{"input":[[1,null,2]],"expected":2},{"input":[null],"expected":0}]',
   'The height of a tree is the length of the longest path from root to a leaf. Recursively, it is 1 (current node) plus the taller of its two subtrees. The base case is that an empty tree has height 0.',
   'Null tree has height 0 | Single node has height 1 | Height = depth of deepest leaf',
   'Time: O(n) | Space: O(h)',
   '--- All Test Cases ---
TC1: [3,9,20,N,N,15,7]  =>  3
TC2: [1,N,2]  =>  2
TC3: null  =>  0

TC1 tree (level-order input):
         3
        / \\
       9   20
      / \\ / \\
     N  N  15  7
  Out: 3'),

  ('btr_03',
   'Level order traversal',
   'Use a queue. Process all nodes at the current level before pushing their children.',
   'medium',
   'Binary Tree',
   'Push root. For each node dequeued, push its left and right children if they exist.',
   'function levelOrder(root) {
  if (!root) return [];
  const result = [], queue = [root];
  while (queue.length > 0) {
    // Process all nodes at current level
    const levelSize = queue.length;
    const level = [];
    // Dequeue levelSize nodes, push their values to level
    // Push their children to queue
    result.push(level);
  }
  return result;
}',
   '[{"input":[[3,9,20,null,null,15,7]],"expected":[[3],[9,20],[15,7]]},{"input":[[1]],"expected":[[1]]},{"input":[null],"expected":[]}]',
   'BFS on a tree. The key is processing all nodes at the current level before moving to the next. Capture the current queue size at the start of each level  -  that tells you exactly how many nodes belong to this level.',
   'Return array of arrays, one per level | Null root returns empty array',
   'Time: O(n) | Space: O(w) where w = max width of tree',
   '--- All Test Cases ---
TC1: [3,9,20,N,N,15,7]  =>  [[3],[9,20],[15,7]]
TC2: [1]  =>  [[1]]
TC3: null  =>  []

TC1 tree (level-order input):
         3
        / \\
       9   20
      / \\ / \\
     N  N  15  7
  Out: [[3],[9,20],[15,7]]'),

  ('btr_04',
   'Check if tree is symmetric',
   'Compare left and right subtrees mirror-recursively  -  outer nodes and inner nodes must match.',
   'medium',
   'Binary Tree',
   'isMirror(left, right): compare left.val === right.val, then isMirror(left.left, right.right) and isMirror(left.right, right.left).',
   'function isSymmetric(root) {
  function isMirror(left, right) {
    // Base cases: both null = true, one null = false
    // Check values match and recurse on mirror children
  }
  return isMirror(root.left, root.right);
}',
   '[{"input":[[1,2,2,3,4,4,3]],"expected":true},{"input":[[1,2,2,null,3,null,3]],"expected":false}]',
   'A symmetric tree is a mirror of itself. Compare the left subtree and right subtree as mirrors: the outer children of each node must match (left.left vs right.right), and the inner children must match (left.right vs right.left).',
   'Single node is always symmetric | Null root is symmetric | Only structure and values are compared',
   'Time: O(n) | Space: O(h)',
   '--- All Test Cases ---
TC1: [1,2,2,3,4,4,3]  =>  true
TC2: [1,2,2,N,3,N,3]  =>  false

TC1 tree (level-order input):
         1
        / \\
       2   2
      / \\ / \\
     3  4  4  3
  Out: true'),

  ('btr_05',
   'Lowest common ancestor',
   'If the current node is p or q, return it. The LCA is where left and right both return non-null.',
   'medium',
   'Binary Tree',
   'If both sides return non-null, the current node is the LCA.',
   'function lowestCommonAncestor(root, p, q) {
  // Base case: root is null, or root === p, or root === q  -  return root
  // Recurse on left and right
  // If both return non-null, current node is LCA
  // Otherwise return whichever is non-null
}',
   '[{"input":[[3,5,1,6,2,0,8,null,null,7,4],5,1],"expected":3},{"input":[[3,5,1,6,2,0,8,null,null,7,4],5,4],"expected":5}]',
   'The LCA is the deepest node that has both p and q in its subtree. The recursive trick: if you find p in the left subtree and q in the right (or vice versa), the current node must be the LCA. If both are on the same side, return that side''s result.',
   'Both p and q are guaranteed to exist in the tree | p != q | Result is always defined',
   'Time: O(n) | Space: O(h)',
   '--- All Test Cases ---
TC1: [3,5,1,6,2,0,8,N,N,7,4], 5, 1  =>  3
TC2: [3,5,1,6,2,0,8,N,N,7,4], 5, 4  =>  5

TC1 tree (level-order input):
  Level-order: [3,5,1,6,2,0,8,N,N,7,...]
  Out: 3'),

  ('btr_06',
   'Maximum path sum',
   'At each node compute the best single-arm gain downward. Update global max with both arms combined.',
   'hard',
   'Binary Tree',
   'gain(node) = node.val + max(0, gain(left)) + max(0, gain(right)). But return only one arm.',
   'function maxPathSum(root) {
  let maxSum = -Infinity;
  function gain(node) {
    // Base case: null returns 0
    // Compute left gain and right gain (floor at 0)
    // Update maxSum with node.val + leftGain + rightGain
    // Return node.val + max(leftGain, rightGain) for parent
  }
  gain(root);
  return maxSum;
}',
   '[{"input":[[1,2,3]],"expected":6},{"input":[[-10,9,20,null,null,15,7]],"expected":42}]',
   'A path can go through any node but cannot fork  -  it must be a continuous line. At each node, try combining both arms (for the global max), but only pass one arm upward (can''t fork). Clamp contributions at 0 because a negative subtree is always better ignored.',
   'Tree has at least 1 node | Values can be negative | Path must contain at least one node | Path cannot revisit nodes',
   'Time: O(n) | Space: O(h)',
   '--- All Test Cases ---
TC1: [1,2,3]  =>  6
TC2: [-10,9,20,N,N,15,7]  =>  42

TC1 tree (level-order input):
      1
     / \\
    2   3
  Out: 6'),

  ('btr_07',
   'Serialize and deserialize a tree',
   'Encode with preorder traversal using a null marker. Rebuild by consuming the encoded list.',
   'hard',
   'Binary Tree',
   'serialize: preorder, write ''null'' for empty nodes. deserialize: consume list with a pointer.',
   'function serialize(root) {
  // Preorder traversal, join with commas, use ''null'' for empty nodes
}

function deserialize(data) {
  const nodes = data.split('','');
  let index = 0;
  function build() {
    // If nodes[index] === ''null'', index++ and return null
    // Otherwise create node with parseInt value, index++
    // Recurse for left and right
  }
  return build();
}',
   '[{"input":[[1,2,3,null,null,4,5]],"expected":[1,2,3,null,null,4,5],"note":"standard tree"},{"input":[null],"expected":null,"note":"empty tree"},{"input":[[1]],"expected":[1],"note":"single node"},{"input":[[1,2,null,3]],"expected":[1,2,null,3],"note":"left-skewed partial tree"}]',
   'Preorder (root, left, right) with explicit null markers is self-describing  -  you can reconstruct the exact tree from this string. Consume the encoded list left-to-right during deserialization, building nodes recursively just as you would traverse.',
   'Any valid binary tree | Null tree serializes to "null" | Node values are integers',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: [1,2,3,N,N,4,5]  =>  [1,2,3,null,null,4,5]
TC2: null  =>  null
TC3: [1]  =>  [1]
TC4: [1,2,N,3]  =>  [1,2,null,3]

TC1 tree (level-order input):
         1
        / \\
       2   3
      / \\ / \\
     N  N  4  5
  Out: [1,2,3,null,null,4,5]'),

  ('bst_01',
   'Search in a BST',
   'Go left if target is smaller, right if larger. Return the node when values match.',
   'easy',
   'BST',
   'if (val < node.val) recurse left. if (val > node.val) recurse right.',
   'function searchBST(root, val) {
  // Base case: root is null or root.val === val, return root
  // If val < root.val, search left
  // If val > root.val, search right
}',
   '[{"input":[[4,2,7,1,3],2],"expected":[2,1,3]},{"input":[[4,2,7,1,3],5],"expected":null}]',
   'BST property: everything in the left subtree is smaller than the root; everything in the right is larger. This lets you eliminate half the tree at each step  -  just like binary search on an array.',
   'BST property is guaranteed | Return null if value not found | Values are unique',
   'Time: O(h) where h = height | Space: O(h)',
   '--- All Test Cases ---
TC1: [4,2,7,1,3], 2  =>  [2,1,3]
TC2: [4,2,7,1,3], 5  =>  null

TC1 tree (level-order input):
         4
        / \\
       2   7
      / \\ / \\
     1  3  .  .
  Out: [2,1,3]'),

  ('bst_02',
   'Insert into a BST',
   'Find the correct null leaf position following BST ordering and insert the new node there.',
   'easy',
   'BST',
   'Recurse to the correct position. When you hit null, return a new node.',
   'function insertBST(root, val) {
  // Base case: root is null, return new node with val
  // If val < root.val, root.left = insertBST(root.left, val)
  // If val > root.val, root.right = insertBST(root.right, val)
  // Return root
}',
   '[{"input":[[4,2,7,1,3],5],"expected":[4,2,7,1,3,5]},{"input":[null,5],"expected":[5]}]',
   'Navigate the BST exactly as you would for search. When you fall off the tree (hit null), that is the correct insertion spot. The recursive structure naturally builds the connection back up.',
   'New value is always unique (no duplicates) | Null tree becomes a single node | BST property must be maintained after insert',
   'Time: O(h) | Space: O(h)',
   '--- All Test Cases ---
TC1: [4,2,7,1,3], 5  =>  [4,2,7,1,3,5]
TC2: null, 5  =>  [5]

TC1 tree (level-order input):
         4
        / \\
       2   7
      / \\ / \\
     1  3  .  .
  Out: [4,2,7,1,3,5]'),

  ('bst_03',
   'Validate a BST',
   'Pass down a valid range per node. Left must be less than node, right must be greater.',
   'medium',
   'BST',
   'validate(node, min, max). Left subtree: max = node.val. Right subtree: min = node.val.',
   'function isValidBST(root) {
  function validate(node, min, max) {
    // Base case: null returns true
    // If node.val <= min or node.val >= max return false
    // Recurse left with max = node.val
    // Recurse right with min = node.val
  }
  return validate(root, -Infinity, Infinity);
}',
   '[{"input":[[2,1,3]],"expected":true},{"input":[[5,1,4,null,null,3,6]],"expected":false}]',
   'You cannot just check that each node is greater than its left child and less than its right child  -  you must carry valid ranges down the tree. A node in the right subtree of the root must be greater than the root, not just its immediate parent.',
   'Node values can be any integer (use -Infinity/Infinity as initial bounds) | No duplicate values in a valid BST',
   'Time: O(n) | Space: O(h)',
   '--- All Test Cases ---
TC1: [2,1,3]  =>  true
TC2: [5,1,4,N,N,3,6]  =>  false

TC1 tree (level-order input):
      2
     / \\
    1   3
  Out: true'),

  ('bst_04',
   'Kth smallest element in BST',
   'Inorder traversal gives sorted order. Stop and return at the kth visited node.',
   'medium',
   'BST',
   'Keep a counter. Increment on each visit. Return node.val when counter equals k.',
   'function kthSmallestBST(root, k) {
  let count = 0, result = null;
  function inorder(node) {
    // Base case: null or result found, return
    // Recurse left
    // Increment count, if count === k set result
    // Recurse right
  }
  inorder(root);
  return result;
}',
   '[{"input":[[3,1,4,null,2],1],"expected":1},{"input":[[5,3,6,2,4,null,null,1],3],"expected":3}]',
   'Inorder traversal of a BST visits nodes in ascending sorted order. Count nodes as you visit them. The kth node visited is the kth smallest.',
   '1 <= k <= number of nodes | BST property guaranteed | Values are unique',
   'Time: O(h + k) | Space: O(h)',
   '--- All Test Cases ---
TC1: [3,1,4,N,2], 1  =>  1
TC2: [5,3,6,2,4,N,N,1], 3  =>  3

TC1 tree (level-order input):
         3
        / \\
       1   4
      / \\ / \\
     N  2  .  .
  Out: 1'),

  ('bst_05',
   'Delete a node from BST',
   'Three cases  -  leaf, one child, two children. For two children replace with inorder successor.',
   'medium',
   'BST',
   'Inorder successor = leftmost node in the right subtree.',
   'function deleteNode(root, key) {
  // If key < root.val recurse left
  // If key > root.val recurse right
  // If key === root.val:
  //   if no left child return root.right
  //   if no right child return root.left
  //   otherwise find inorder successor (min of right subtree)
  //   replace root.val with successor.val
  //   delete successor from right subtree
  return root;
}',
   '[{"input":[[5,3,6,2,4,null,7],3],"expected":[5,4,6,2,null,null,7]},{"input":[[5,3,6,2,4,null,7],0],"expected":[5,3,6,2,4,null,7]}]',
   'Case 1 (leaf): just remove. Case 2 (one child): replace node with its child. Case 3 (two children): find the inorder successor (leftmost in right subtree), copy its value, then delete the successor (which has at most one child).',
   'Key may not exist (tree unchanged) | BST property must be maintained after deletion | Values are unique',
   'Time: O(h) | Space: O(h)',
   '--- All Test Cases ---
TC1: [5,3,6,2,4,N,7], 3  =>  [5,4,6,2,null,null,7]
TC2: [5,3,6,2,4,N,7], 0  =>  [5,3,6,2,4,null,7]

TC1 tree (level-order input):
         5
        / \\
       3   6
      / \\ / \\
     2  4  N  7
  Out: [5,4,6,2,null,null,7]'),

  ('bst_06',
   'Balance a BST',
   'Inorder traversal to get sorted array, then recursively build from the middle element.',
   'hard',
   'BST',
   'sortedArrayToBST: pick mid as root, recurse on left half for left child, right half for right child.',
   'function balanceBST(root) {
  const sorted = [];
  function inorder(node) {
    // Collect nodes in sorted order
  }
  function build(left, right) {
    // Base case: left > right return null
    // mid = Math.floor((left + right) / 2)
    // Create node with sorted[mid]
    // Build left and right subtrees
  }
  inorder(root);
  return build(0, sorted.length - 1);
}',
   '[{"input":[[1,null,2,null,3,null,4]],"expected":[2,1,3,null,null,null,4],"note":"right-skewed to balanced"},{"input":[[1]],"expected":[1],"note":"single node stays same"},{"input":[[1,null,2]],"expected":[1,null,2],"note":"two nodes"},{"input":[[3,2,null,1]],"expected":[2,1,3],"note":"left-skewed to balanced"}]',
   'Inorder traversal gives a sorted array. To build a balanced BST from a sorted array, always pick the middle element as root  -  this ensures equal elements on both sides. Recurse on left and right halves.',
   'Input is a valid BST (possibly unbalanced) | Output should be height-balanced | Multiple valid answers accepted',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: [1,N,2,N,3,N,4]  =>  [2,1,3,null,null,null,4]
TC2: [1]  =>  [1]
TC3: [1,N,2]  =>  [1,null,2]
TC4: [3,2,N,1]  =>  [2,1,3]

TC1 tree (level-order input):
         1
        / \\
       N   2
      / \\ / \\
     N  3  N  4
  Out: [2,1,3,null,null,null,4]'),

  ('dp_01',
   'Fibonacci with memoization',
   'Store computed values in a table. Before computing fib(n) check if it is already stored.',
   'easy',
   'Dynamic Programming',
   'memo = {}. if (memo[n]) return memo[n]. memo[n] = fib(n-1) + fib(n-2).',
   'function fibMemo(n, memo = {}) {
  // Check if already computed
  // Base cases: n <= 1
  // Compute, store in memo, return
}',
   '[{"input":[10],"expected":55},{"input":[0],"expected":0},{"input":[1],"expected":1},{"input":[6],"expected":8}]',
   'Memoization turns exponential recursion into linear by caching results. Before computing fib(n), check if it is already in the cache. This ensures each subproblem is computed only once.',
   '0 <= n <= 50 | fib(0)=0, fib(1)=1 by definition',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: 10  =>  55
TC2: 0  =>  0
TC3: 1  =>  1
TC4: 6  =>  8

TC1:
  In:  10
  Out: 55'),

  ('dp_02',
   'Climbing stairs',
   'To reach stair n you came from n-1 or n-2. Same recurrence as Fibonacci.',
   'easy',
   'Dynamic Programming',
   'dp[i] = dp[i-1] + dp[i-2]. Base cases: dp[1] = 1, dp[2] = 2.',
   'function climbStairs(n) {
  // Step 1: create dp array of size n+1
  // Step 2: dp[1] = 1, dp[2] = 2
  // Step 3: for i from 3 to n: dp[i] = dp[i-1] + dp[i-2]
  // Step 4: return dp[n]
}',
   '[{"input":[2],"expected":2},{"input":[3],"expected":3},{"input":[5],"expected":8},{"input":[10],"expected":89}]',
   'The number of ways to reach step n equals the sum of ways to reach n-1 (take 1 step) and n-2 (take 2 steps). This is exactly the Fibonacci recurrence! Build up from small cases.',
   '1 <= n <= 45 | You can take 1 or 2 steps at a time',
   'Time: O(n) | Space: O(n), optimizable to O(1)',
   '--- All Test Cases ---
TC1: 2  =>  2
TC2: 3  =>  3
TC3: 5  =>  8
TC4: 10  =>  89

TC1:
  In:  2
  Out: 2'),

  ('dp_03',
   '0/1 Knapsack',
   'dp[i][w] = best value using first i items with capacity w. Pick max of include vs exclude.',
   'medium',
   'Dynamic Programming',
   'Include: dp[i-1][w - weight[i]] + value[i]. Exclude: dp[i-1][w]. Take the max.',
   'function knapsack(weights, values, capacity) {
  const n = weights.length;
  const dp = Array.from({length: n+1}, () => new Array(capacity+1).fill(0));
  for (let i = 1; i <= n; i++) {
    for (let w = 0; w <= capacity; w++) {
      // Option 1: exclude item i
      // Option 2: include item i (if it fits)
      // dp[i][w] = max of both options
    }
  }
  return dp[n][capacity];
}',
   '[{"input":[[1,3,4,5],[1,4,5,7],7],"expected":9},{"input":[[2,3,4,5],[3,4,5,6],5],"expected":7}]',
   'For each item, you have two choices: take it or leave it. Build a 2D table where dp[i][w] = max value using the first i items with weight capacity w. Each cell depends on the row above it.',
   'weights[i] and values[i] are positive | 1 <= n <= 100 | 1 <= capacity <= 1000 | Each item can be used at most once',
   'Time: O(n * capacity) | Space: O(n * capacity)',
   '--- All Test Cases ---
TC1: [1,3,4,5], [1,4,5,7], 7  =>  9
TC2: [2,3,4,5], [3,4,5,6], 5  =>  7

TC1 input:
  +---+---+---+---+
  | 1 | 3 | 4 | 5 |
  +---+---+---+---+
   0   1   2   3  
  arg2: [1,4,5,7]
  arg3: 7
TC1 output:
  9'),

  ('dp_04',
   'Longest common subsequence',
   'If characters match, extend the diagonal. Otherwise take the max of left or top cell.',
   'medium',
   'Dynamic Programming',
   'dp[i][j] = dp[i-1][j-1] + 1 if match. Else max(dp[i-1][j], dp[i][j-1]).',
   'function lcs(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // If characters match, dp[i][j] = dp[i-1][j-1] + 1
      // Else dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    }
  }
  return dp[m][n];
}',
   '[{"input":["abcde","ace"],"expected":3},{"input":["abc","abc"],"expected":3},{"input":["abc","def"],"expected":0}]',
   'LCS is not necessarily a contiguous substring. Build a grid where dp[i][j] = length of LCS of s1[0..i-1] and s2[0..j-1]. When characters match, we can extend the previous LCS by 1. Otherwise, take the best of skipping one character from either string.',
   '1 <= s1.length, s2.length <= 1000 | Lowercase letters | LCS may be empty (return 0)',
   'Time: O(m * n) | Space: O(m * n)',
   '--- All Test Cases ---
TC1: "abcde", "ace"  =>  3
TC2: "abc", "abc"  =>  3
TC3: "abc", "def"  =>  0

TC1:
  In:  "abcde", "ace"
  Out: 3'),

  ('dp_05',
   'Coin change  -  minimum coins',
   'For each amount, build up from smaller amounts. dp[amount] = minimum coins needed.',
   'medium',
   'Dynamic Programming',
   'dp[i] = min(dp[i], dp[i - coin] + 1) for each coin that fits.',
   'function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      // If coin <= i and dp[i - coin] + 1 < dp[i]
      //   update dp[i]
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}',
   '[{"input":[[1,5,6,9],11],"expected":2},{"input":[[2],3],"expected":-1},{"input":[[1,2,5],11],"expected":3}]',
   'Unlike the greedy approach (which only works for canonical coins), DP works for any coin system. Build up: dp[0]=0. For each amount, try every coin  -  if subtracting the coin leaves an achievable amount, you might reach the current amount in one more coin.',
   'coins contains positive integers | 1 <= amount <= 10^4 | Coins can be reused | Return -1 if impossible',
   'Time: O(amount * coins.length) | Space: O(amount)',
   '--- All Test Cases ---
TC1: [1,5,6,9], 11  =>  2
TC2: [2], 3  =>  -1
TC3: [1,2,5], 11  =>  3

TC1 input:
  +---+---+---+---+
  | 1 | 5 | 6 | 9 |
  +---+---+---+---+
   0   1   2   3  
  arg2: 11
TC1 output:
  2'),

  ('dp_06',
   'Edit distance',
   'Cost of transforming one string into another via insert, delete, replace. Fill a 2D DP grid.',
   'hard',
   'Dynamic Programming',
   'If chars match: dp[i][j] = dp[i-1][j-1]. Else: 1 + min(insert, delete, replace).',
   'function editDistance(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({length: m+1}, (_, i) => new Array(n+1).fill(0).map((_, j) => i || j));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // If s1[i-1] === s2[j-1], dp[i][j] = dp[i-1][j-1]
      // Else 1 + min of: dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)
    }
  }
  return dp[m][n];
}',
   '[{"input":["horse","ros"],"expected":3},{"input":["intention","execution"],"expected":5},{"input":["","abc"],"expected":3}]',
   'Three operations: insert, delete, replace. The DP table captures: dp[i][j] = minimum edits to transform s1[0..i-1] into s2[0..j-1]. The first row/column handles the base cases (converting to/from empty string).',
   '0 <= s1.length, s2.length <= 500 | All lowercase | Empty string to non-empty costs the length of the non-empty string',
   'Time: O(m * n) | Space: O(m * n)',
   '--- All Test Cases ---
TC1: "horse", "ros"  =>  3
TC2: "intention", "execution"  =>  5
TC3: "", "abc"  =>  3

TC1:
  In:  "horse", "ros"
  Out: 3'),

  ('dp_07',
   'Longest increasing subsequence',
   'dp[i] = length of LIS ending at index i. For each j < i check if arr[j] < arr[i].',
   'hard',
   'Dynamic Programming',
   'dp[i] = 1 + max(dp[j]) for all j < i where arr[j] < arr[i]. Answer is max of dp.',
   'function lis(arr) {
  const dp = new Array(arr.length).fill(1);
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      // If arr[j] < arr[i], dp[i] = Math.max(dp[i], dp[j] + 1)
    }
  }
  return Math.max(...dp);
}',
   '[{"input":[[10,9,2,5,3,7,101,18]],"expected":4},{"input":[[0,1,0,3,2,3]],"expected":4},{"input":[[7,7,7,7]],"expected":1}]',
   'For each element, find the longest increasing subsequence that ends at that element. This requires checking all previous elements that are smaller. The answer is the maximum dp value across all indices.',
   '1 <= arr.length <= 2500 | Values can be negative | Strictly increasing (equal elements do not extend LIS)',
   'Time: O(n^2) | Space: O(n)',
   '--- All Test Cases ---
TC1: [10,9,2,5,3,7,101,18]  =>  4
TC2: [0,1,0,3,2,3]  =>  4
TC3: [7,7,7,7]  =>  1

TC1 input:
  +----+---+---+---+---+---+-----+----+
  | 10 | 9 | 2 | 5 | 3 | 7 | 101 | 18 |
  +----+---+---+---+---+---+-----+----+
   0    1   2   3   4   5   6     7   
TC1 output:
  4'),

  ('tr_01',
   'Insert a word into a trie',
   'For each character, create a child node if it does not exist. Mark the last node as end of word.',
   'easy',
   'Trie',
   'node.children[ch] = node.children[ch] || {}. After loop, node.isEnd = true.',
   'class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    // Start at root
    // For each character, create child node if missing
    // Mark isEnd = true at last node
  }

  search(word) {
    // Start at root
    // For each character, if child missing return false
    // After loop, return node.isEnd
  }

  startsWith(prefix) {
    // Start at root
    // For each character, if child missing return false
    // After full prefix traversal, return true
  }

  countPrefix(prefix) {
    // Traverse to prefix end node
    // If not found return 0
    // DFS from that node, count isEnd nodes
  }
}',
   '[{"ops":["insert","search","search"],"args":[["apple"],["apple"],["app"]],"expected":[null,true,false],"note":"insert apple, search full word and prefix"},{"ops":["insert","insert","search","search"],"args":[["hello"],["world"],["hello"],["hell"]],"expected":[null,null,true,false],"note":"two words, only full words found"},{"ops":["insert","search"],"args":[["a"],["a"]],"expected":[null,true],"note":"single character word"},{"ops":["search"],"args":[["anything"]],"expected":[false],"note":"search in empty trie"}]',
   'A Trie (prefix tree) stores characters along edges. Each path from root to an "isEnd" node spells a word. To insert, walk character by character, creating nodes as needed. Mark the last character''s node as end-of-word.',
   'Words contain lowercase English letters only | Multiple inserts of the same word are idempotent | Trie can hold any number of words',
   'Time: O(L) per insert where L = word length | Space: O(L * n) for n words',
   'Op          | Args         | Returns
------------+--------------+----------
insert      | (apple)      | -
search      | (apple)      | true
search      | (app)        | false

Other test cases:
  TC2: two words, only full words found  =>  [true,false]
  TC3: single character word  =>  [true]
  TC4: search in empty trie  =>  [false]'),

  ('tr_02',
   'Search for a word in a trie',
   'Traverse character by character. Return false if any node is missing. Check end marker at last.',
   'easy',
   'Trie',
   'Return false if children[ch] does not exist. Return node.isEnd at the end.',
   'class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    // Start at root
    // For each character, create child node if missing
    // Mark isEnd = true at last node
  }

  search(word) {
    // Start at root
    // For each character, if child missing return false
    // After loop, return node.isEnd
  }

  startsWith(prefix) {
    // Start at root
    // For each character, if child missing return false
    // After full prefix traversal, return true
  }

  countPrefix(prefix) {
    // Traverse to prefix end node
    // If not found return 0
    // DFS from that node, count isEnd nodes
  }
}',
   '[{"ops":["insert","search","search","search"],"args":[["apple"],["apple"],["app"],["ap"]],"expected":[null,true,false,false],"note":"only exact word returns true"},{"ops":["insert","insert","search","search"],"args":[["app"],["apple"],["app"],["apple"]],"expected":[null,null,true,true],"note":"both prefix and full word inserted"},{"ops":["insert","search"],"args":[["cat"],["dog"]],"expected":[null,false],"note":"word not in trie"},{"ops":["insert","search","search"],"args":[["z"],["z"],["zz"]],"expected":[null,true,false],"note":"single char and longer not found"}]',
   'Searching in a trie is like insert but read-only. Follow each character. If a child node is missing, the word doesn''t exist. If you reach the end of the word, check isEnd  -  the path might exist as a prefix but not as a complete word.',
   'Returns true only for exact matches | "app" is NOT found if only "apple" was inserted (unless "app" was also inserted)',
   'Time: O(L) | Space: O(1)',
   'Op          | Args         | Returns
------------+--------------+----------
insert      | (apple)      | -
search      | (apple)      | true
search      | (app)        | false
search      | (ap)         | false

Other test cases:
  TC2: both prefix and full word inserted  =>  [true,true]
  TC3: word not in trie  =>  [false]
  TC4: single char and longer not found  =>  [true,false]'),

  ('tr_03',
   'Check if any word starts with a prefix',
   'Same traversal as search but do not check the end-of-word marker  -  just confirm traversal succeeds.',
   'medium',
   'Trie',
   'Return true if you reach the end of the prefix without hitting a missing node.',
   'class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    // Start at root
    // For each character, create child node if missing
    // Mark isEnd = true at last node
  }

  search(word) {
    // Start at root
    // For each character, if child missing return false
    // After loop, return node.isEnd
  }

  startsWith(prefix) {
    // Start at root
    // For each character, if child missing return false
    // After full prefix traversal, return true
  }

  countPrefix(prefix) {
    // Traverse to prefix end node
    // If not found return 0
    // DFS from that node, count isEnd nodes
  }
}',
   '[{"ops":["insert","startsWith","startsWith"],"args":[["apple"],["app"],["apl"]],"expected":[null,true,false],"note":"valid and invalid prefix"},{"ops":["insert","startsWith","startsWith"],"args":[["hello"],["hel"],["world"]],"expected":[null,true,false],"note":"prefix exists, different word does not"},{"ops":["insert","startsWith"],"args":[["abc"],["abc"]],"expected":[null,true],"note":"full word is also a valid prefix"},{"ops":["startsWith"],"args":[["anything"]],"expected":[false],"note":"prefix search on empty trie"}]',
   'StartsWith is exactly like search but stops at the end of the prefix (does not require isEnd to be true). If the path exists in the trie, at least one inserted word shares this prefix.',
   'Any string is a valid prefix of itself | Empty prefix would match any non-empty trie (handle as edge case)',
   'Time: O(L) | Space: O(1)',
   'Op          | Args         | Returns
------------+--------------+----------
insert      | (apple)      | -
startsWith  | (app)        | true
startsWith  | (apl)        | false

Other test cases:
  TC2: prefix exists, different word does not  =>  [true,false]
  TC3: full word is also a valid prefix  =>  [true]
  TC4: prefix search on empty trie  =>  [false]'),

  ('tr_04',
   'Count words with a given prefix',
   'Reach the prefix end node, then count all isEnd flags in the subtree using DFS.',
   'medium',
   'Trie',
   'After traversing to prefix end, run DFS and count nodes where isEnd is true.',
   'class TrieNode {
  constructor() { this.children = {}; this.isEnd = false; }
}

class Trie {
  constructor() { this.root = new TrieNode(); }

  insert(word) {
    // Start at root
    // For each character, create child node if missing
    // Mark isEnd = true at last node
  }

  search(word) {
    // Start at root
    // For each character, if child missing return false
    // After loop, return node.isEnd
  }

  startsWith(prefix) {
    // Start at root
    // For each character, if child missing return false
    // After full prefix traversal, return true
  }

  countPrefix(prefix) {
    // Traverse to prefix end node
    // If not found return 0
    // DFS from that node, count isEnd nodes
  }
}',
   '[{"ops":["insert","insert","insert","countPrefix"],"args":[["app"],["apple"],["apply"],["app"]],"expected":[null,null,null,3],"note":"app apple apply all start with app"},{"ops":["insert","insert","countPrefix","countPrefix"],"args":[["hello"],["world"],["hel"],["wor"]],"expected":[null,null,1,1],"note":"one word per prefix"},{"ops":["insert","countPrefix"],"args":[["test"],["xyz"]],"expected":[null,0],"note":"prefix not found returns 0"},{"ops":["insert","insert","insert","countPrefix"],"args":[["a"],["ab"],["abc"],["a"]],"expected":[null,null,null,3],"note":"all words share prefix a"}]',
   'Navigate to the prefix endpoint in the trie, then count all word endings (isEnd=true) reachable from that node via DFS. This counts all inserted words that begin with the given prefix.',
   'Prefix not found returns 0 | The prefix itself counts if it was inserted as a word',
   'Time: O(L + W) where W = matching words total length | Space: O(L)',
   'Op           | Args         | Returns
-------------+--------------+----------
insert       | (app)        | -
insert       | (apple)      | -
insert       | (apply)      | -
countPrefix  | (app)        | 3

Other test cases:
  TC2: one word per prefix  =>  [1,1]
  TC3: prefix not found returns 0  =>  [0]
  TC4: all words share prefix a  =>  [3]'),

  ('tr_05',
   'Longest word built character by character',
   'Every prefix of the word must also exist in the trie as a complete word.',
   'hard',
   'Trie',
   'Insert all words. Then find the longest word where every prefix is a complete word (isEnd = true).',
   'function longestWord(words) {
  // Insert all words into trie
  // For each word, check if every prefix exists as isEnd
  // Return the longest such word (lexicographically smaller if tie)
}',
   '[{"input":[["w","wo","wor","worl","world"]],"expected":"world","note":"all prefixes present"},{"input":[["a","banana","app","appl","ap","apply","apple"]],"expected":"apple","note":"apple wins over apply lexicographically"},{"input":[["a","b","c"]],"expected":"a","note":"all single chars, return first"},{"input":[["ab","a"]],"expected":"ab","note":"simple two-step build"}]',
   'A word can be "built" if every single prefix is itself a word in the list. Insert all words, then for each word check that each of its prefixes has isEnd=true. Return the longest such word, breaking ties lexicographically.',
   'At least one word in input | Lowercase letters | Tie-break: return lexicographically smallest',
   'Time: O(total chars) | Space: O(total chars)',
   '--- All Test Cases ---
TC1: ["w","wo","wor","worl","world"]  =>  "world"
TC2: ["a","banana","app","appl","ap","apply","apple"]  =>  "apple"
TC3: ["a","b","c"]  =>  "a"
TC4: ["ab","a"]  =>  "ab"

TC1 input:
  +---+----+-----+------+-------+
  | w | wo | wor | worl | world |
  +---+----+-----+------+-------+
   0   1    2     3      4      
TC1 output:
  "world"'),

  ('tr_06',
   'Word search II  -  trie plus backtracking',
   'Build a trie from word list. DFS on the grid using the trie to prune invalid paths early.',
   'hard',
   'Trie',
   'At each cell, if no trie child exists for that character, backtrack immediately.',
   'function findWords(board, words) {
  // Step 1: build trie from words
  // Step 2: DFS from every cell
  //   track current trie node
  //   if node has no child for board[r][c], return early
  //   if node.isEnd, add word to results
  //   mark cell visited, recurse 4 directions, unmark
  return results;
}',
   '[{"input":[[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]],["oath","pea","eat","rain"]],"expected":["oath","eat"],"note":"standard board search"},{"input":[[["a","b"],["c","d"]],["abdc","abcd","abca"]],"expected":["abdc","abcd"],"note":"small board multiple paths"},{"input":[[["a"]],["a"]],"expected":["a"],"note":"1x1 board single letter word"},{"input":[[["a","b"],["c","d"]],["abdc"]],"expected":["abdc"],"note":"word wraps around the board"}]',
   'The trie provides instant pruning: if no word in the list starts with the current path prefix, stop immediately without exploring further. This is far faster than checking each word against DFS paths separately.',
   'Board cells can only be used once per word path | Words list may contain words not findable | Result order does not matter',
   'Time: O(M*N*4^L) where L = max word length, with trie pruning | Space: O(W*L) for trie',
   '--- All Test Cases ---
TC1: [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]  =>  ["oath","eat"]
TC2: [["a","b"],["c","d"]], ["abdc","abcd","abca"]  =>  ["abdc","abcd"]
TC3: [["a"]], ["a"]  =>  ["a"]
TC4: [["a","b"],["c","d"]], ["abdc"]  =>  ["abdc"]

TC1 input:
  +---------+---------+---------+---------+
  | o,a,a,n | e,t,a,e | i,h,k,r | i,f,l,v |
  +---------+---------+---------+---------+
   0         1         2         3        
  arg2: ["oath","pea","eat","rain"]
TC1 output:
  +------+-----+
  | oath | eat |
  +------+-----+
   0      1    '),

  ('sort_01',
   'Bubble sort',
   'Compare adjacent elements and swap if out of order. Repeat passes until no swaps occur.',
   'easy',
   'Sorting Algorithms',
   'After each pass the largest unsorted element bubbles to its correct position.',
   'function bubbleSort(arr) {
  // Step 1: outer loop  -  n-1 passes
  // Step 2: inner loop  -  compare arr[j] and arr[j+1]
  // Step 3: swap if arr[j] > arr[j+1]
  // Optimisation: track a swapped flag  -  if no swaps occurred, array is sorted
  return arr;
}',
   '[{"input":[[5,3,1,4,2]],"expected":[1,2,3,4,5]},{"input":[[1,2,3,4,5]],"expected":[1,2,3,4,5]},{"input":[[5,4,3,2,1]],"expected":[1,2,3,4,5]},{"input":[[1]],"expected":[1]}]',
   'In each pass, compare each adjacent pair and swap if needed. The largest unsorted element "bubbles" to its final position at the end. After n-1 passes, everything is sorted. The swap flag optimisation stops early if no swaps occurred in a pass (already sorted).',
   '1 <= arr.length <= 10^4 | In-place sort | Values can be any integer including duplicates',
   'Time: O(n^2) worst/avg, O(n) best | Space: O(1)',
   '--- All Test Cases ---
TC1: [5,3,1,4,2]  =>  [1,2,3,4,5]
TC2: [1,2,3,4,5]  =>  [1,2,3,4,5]
TC3: [5,4,3,2,1]  =>  [1,2,3,4,5]
TC4: [1]  =>  [1]

TC1 input:
  +---+---+---+---+---+
  | 5 | 3 | 1 | 4 | 2 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 |
  +---+---+---+---+---+
   0   1   2   3   4  '),

  ('sort_02',
   'Selection sort',
   'Find the minimum element in the unsorted portion and swap it to the front.',
   'easy',
   'Sorting Algorithms',
   'Track minIdx across the inner loop. At the end of each pass, swap arr[i] with arr[minIdx].',
   'function selectionSort(arr) {
  // Step 1: outer loop from 0 to n-2
  // Step 2: inner loop finds the index of minimum in arr[i..n-1]
  // Step 3: swap arr[i] with arr[minIdx]
  return arr;
}',
   '[{"input":[[5,3,1,4,2]],"expected":[1,2,3,4,5]},{"input":[[1]],"expected":[1]},{"input":[[2,1]],"expected":[1,2]},{"input":[[3,3,2]],"expected":[2,3,3]}]',
   'Each pass selects the smallest element from the unsorted portion and places it at the correct position. Unlike bubble sort, each element makes at most one swap per pass. The left portion grows sorted with each iteration.',
   '1 <= arr.length <= 10^4 | In-place | Stable? No (equal elements may swap relative order)',
   'Time: O(n^2) | Space: O(1)',
   '--- All Test Cases ---
TC1: [5,3,1,4,2]  =>  [1,2,3,4,5]
TC2: [1]  =>  [1]
TC3: [2,1]  =>  [1,2]
TC4: [3,3,2]  =>  [2,3,3]

TC1 input:
  +---+---+---+---+---+
  | 5 | 3 | 1 | 4 | 2 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 |
  +---+---+---+---+---+
   0   1   2   3   4  '),

  ('sort_03',
   'Insertion sort',
   'Take one element at a time and insert it into its correct position in the already-sorted left portion.',
   'easy',
   'Sorting Algorithms',
   'key = arr[i]. Shift elements right while they are greater than key. Insert key at the gap.',
   'function insertionSort(arr) {
  // Step 1: outer loop from index 1
  // Step 2: key = arr[i], j = i - 1
  // Step 3: while j >= 0 and arr[j] > key, shift arr[j] right
  // Step 4: place key at arr[j+1]
  return arr;
}',
   '[{"input":[[5,3,1,4,2]],"expected":[1,2,3,4,5]},{"input":[[1,2,3]],"expected":[1,2,3]},{"input":[[3,2,1]],"expected":[1,2,3]},{"input":[[1]],"expected":[1]}]',
   'Like sorting playing cards in your hand. Take one card, slide it left past any cards bigger than it, and drop it in the right spot. Efficient for nearly-sorted data. Stable sort.',
   '1 <= arr.length <= 10^4 | In-place | Stable | Efficient for small or nearly-sorted arrays',
   'Time: O(n^2) worst, O(n) best | Space: O(1)',
   '--- All Test Cases ---
TC1: [5,3,1,4,2]  =>  [1,2,3,4,5]
TC2: [1,2,3]  =>  [1,2,3]
TC3: [3,2,1]  =>  [1,2,3]
TC4: [1]  =>  [1]

TC1 input:
  +---+---+---+---+---+
  | 5 | 3 | 1 | 4 | 2 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 |
  +---+---+---+---+---+
   0   1   2   3   4  '),

  ('sort_04',
   'Merge sort',
   'Divide the array in half recursively until single elements. Merge sorted halves back together.',
   'medium',
   'Sorting Algorithms',
   'mergeSort(left) and mergeSort(right) then merge the two sorted halves using two pointers.',
   'function mergeSort(arr) {
  // Base case: arr.length <= 1, return arr
  // Step 1: mid = Math.floor(arr.length / 2)
  // Step 2: left = mergeSort(arr.slice(0, mid))
  // Step 3: right = mergeSort(arr.slice(mid))
  // Step 4: return merge(left, right)
}

function merge(left, right) {
  // Two pointer merge  -  same as merge two sorted arrays
}',
   '[{"input":[[5,3,1,4,2]],"expected":[1,2,3,4,5]},{"input":[[1]],"expected":[1]},{"input":[[2,1]],"expected":[1,2]},{"input":[[5,5,3,1]],"expected":[1,3,5,5]}]',
   'Divide and conquer: keep splitting until you have single elements (always sorted). Then merge pairs of sorted arrays upward. Each merge step is O(n) and there are O(log n) levels, giving O(n log n) total.',
   '1 <= arr.length <= 10^5 | Not in-place (uses extra space) | Stable sort | Consistent O(n log n)',
   'Time: O(n log n) | Space: O(n)',
   '--- All Test Cases ---
TC1: [5,3,1,4,2]  =>  [1,2,3,4,5]
TC2: [1]  =>  [1]
TC3: [2,1]  =>  [1,2]
TC4: [5,5,3,1]  =>  [1,3,5,5]

TC1 input:
  +---+---+---+---+---+
  | 5 | 3 | 1 | 4 | 2 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 |
  +---+---+---+---+---+
   0   1   2   3   4  '),

  ('sort_05',
   'Quick sort',
   'Pick a pivot. Partition elements smaller than pivot to the left, larger to the right. Recurse on both sides.',
   'medium',
   'Sorting Algorithms',
   'Use the last element as pivot. i tracks where the next smaller element should go.',
   'function quickSort(arr, low = 0, high = arr.length - 1) {
  // Base case: low >= high
  // Step 1: pi = partition(arr, low, high)
  // Step 2: quickSort(arr, low, pi - 1)
  // Step 3: quickSort(arr, pi + 1, high)
  return arr;
}

function partition(arr, low, high) {
  // pivot = arr[high]
  // i = low - 1
  // for j from low to high-1: if arr[j] <= pivot, i++, swap arr[i] and arr[j]
  // swap arr[i+1] and arr[high]
  // return i + 1
}',
   '[{"input":[[5,3,1,4,2]],"expected":[1,2,3,4,5]},{"input":[[1]],"expected":[1]},{"input":[[2,1]],"expected":[1,2]},{"input":[[3,3,2,1]],"expected":[1,2,3,3]}]',
   'Pick a pivot, partition everything smaller to the left and larger to the right, then the pivot is in its final sorted position. Recurse on both halves. In-place and cache-friendly, but worst case O(n^2) with bad pivot choices.',
   '1 <= arr.length <= 10^5 | In-place | Not stable | Average O(n log n) but O(n^2) worst case',
   'Time: O(n log n) avg, O(n^2) worst | Space: O(log n) call stack',
   '--- All Test Cases ---
TC1: [5,3,1,4,2]  =>  [1,2,3,4,5]
TC2: [1]  =>  [1]
TC3: [2,1]  =>  [1,2]
TC4: [3,3,2,1]  =>  [1,2,3,3]

TC1 input:
  +---+---+---+---+---+
  | 5 | 3 | 1 | 4 | 2 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 5 |
  +---+---+---+---+---+
   0   1   2   3   4  '),

  ('sort_06',
   'Count sort frequency',
   'Count element frequencies into a bucket array. Reconstruct sorted array from buckets.',
   'hard',
   'Sorting Algorithms',
   'freq[arr[i]]++. Then rebuild arr by writing each value freq[v] times.',
   'function countSort(arr) {
  // Step 1: find max value to size the frequency array
  // Step 2: count frequencies: freq[arr[i]]++
  // Step 3: rebuild arr from freq array
  return arr;
}',
   '[{"input":[[4,2,2,8,3,3,1]],"expected":[1,2,2,3,3,4,8]},{"input":[[1,1,1]],"expected":[1,1,1]},{"input":[[5,1,3]],"expected":[1,3,5]},{"input":[[1]],"expected":[1]}]',
   'Count sort beats comparison-based sorts by not comparing elements at all. Count occurrences of each value, then write them back in order. The trade-off: only works for non-negative integers and uses memory proportional to the max value.',
   'Values must be non-negative integers | 0 <= arr[i] <= max (beware large max values) | Stable',
   'Time: O(n + k) where k = max value | Space: O(k)',
   '--- All Test Cases ---
TC1: [4,2,2,8,3,3,1]  =>  [1,2,2,3,3,4,8]
TC2: [1,1,1]  =>  [1,1,1]
TC3: [5,1,3]  =>  [1,3,5]
TC4: [1]  =>  [1]

TC1 input:
  +---+---+---+---+---+---+---+
  | 4 | 2 | 2 | 8 | 3 | 3 | 1 |
  +---+---+---+---+---+---+---+
   0   1   2   3   4   5   6  
TC1 output:
  +---+---+---+---+---+---+---+
  | 1 | 2 | 2 | 3 | 3 | 4 | 8 |
  +---+---+---+---+---+---+---+
   0   1   2   3   4   5   6  '),

  ('tp_01',
   'Remove duplicates from sorted array',
   'Use a slow pointer to track where the next unique element should go. Fast pointer scans ahead.',
   'easy',
   'Two Pointers',
   'If arr[fast] !== arr[slow], increment slow and copy arr[fast] to arr[slow].',
   'function removeDuplicates(arr) {
  // Step 1: slow = 0, fast = 1
  // Step 2: while fast < arr.length
  //   if arr[fast] !== arr[slow], slow++, arr[slow] = arr[fast]
  //   fast++
  // Step 3: return slow + 1 (length of unique portion)
}',
   '[{"input":[[1,1,2,3,3,4]],"expected":4},{"input":[[1,2,3]],"expected":3},{"input":[[1,1,1]],"expected":1},{"input":[[1]],"expected":1}]',
   'Since the array is sorted, duplicates are adjacent. Keep a slow pointer for the "write position" and fast pointer for scanning. When fast finds a new unique value, write it at slow+1. Return how many unique elements there are.',
   'Array is sorted in non-decreasing order | In-place modification | Return length of unique portion (first k elements)',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1,1,2,3,3,4]  =>  4
TC2: [1,2,3]  =>  3
TC3: [1,1,1]  =>  1
TC4: [1]  =>  1

TC1 input:
  +---+---+---+---+---+---+
  | 1 | 1 | 2 | 3 | 3 | 4 |
  +---+---+---+---+---+---+
   0   1   2   3   4   5  
TC1 output:
  4'),

  ('tp_02',
   'Two sum on sorted array',
   'Start pointers at both ends. Move left pointer right if sum is too small, right pointer left if too large.',
   'easy',
   'Two Pointers',
   'sum = arr[left] + arr[right]. If sum < target left++. If sum > target right--.',
   'function twoSum(arr, target) {
  // Step 1: left = 0, right = arr.length - 1
  // Step 2: while left < right
  //   sum = arr[left] + arr[right]
  //   if sum === target return [left, right]
  //   if sum < target left++
  //   else right--
  // Step 3: return [] if not found
}',
   '[{"input":[[1,2,3,4,6],6],"expected":[1,3]},{"input":[[1,5,10,20],25],"expected":[1,3]},{"input":[[1,2],3],"expected":[0,1]},{"input":[[1,2,3],7],"expected":[]}]',
   'Works only on sorted arrays. Two pointers converge from both ends. Moving left pointer increases the sum; moving right pointer decreases it. This logical narrowing means you never need more than O(n) total pointer moves.',
   'Array must be sorted | Exactly one solution assumed | Return 0-indexed positions | Elements may not be reused',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1,2,3,4,6], 6  =>  [1,3]
TC2: [1,5,10,20], 25  =>  [1,3]
TC3: [1,2], 3  =>  [0,1]
TC4: [1,2,3], 7  =>  []

TC1 input:
  +---+---+---+---+---+
  | 1 | 2 | 3 | 4 | 6 |
  +---+---+---+---+---+
   0   1   2   3   4  
  arg2: 6
TC1 output:
  +---+---+
  | 1 | 3 |
  +---+---+
   0   1  '),

  ('tp_03',
   'Three sum  -  find all triplets that sum to zero',
   'Sort the array. For each element, use two pointers on the rest to find pairs that complete the triplet.',
   'medium',
   'Two Pointers',
   'Fix arr[i], then left = i+1, right = n-1. Same two-sum logic on the remaining window.',
   'function threeSum(arr) {
  // Step 1: sort arr
  // Step 2: for each i from 0 to n-3
  //   skip duplicates at i
  //   left = i+1, right = n-1
  //   two pointer on arr[left..right] targeting -arr[i]
  //   skip duplicates at left and right after finding a triplet
  // Step 3: return result
}',
   '[{"input":[[-1,0,1,2,-1,-4]],"expected":[[-1,-1,2],[-1,0,1]]},{"input":[[0,0,0]],"expected":[[0,0,0]]},{"input":[[1,2,3]],"expected":[]},{"input":[[-2,0,1,1,2]],"expected":[[-2,0,2],[-2,1,1]]}]',
   'Fix one element as the target complement, then reduce to two-sum on the remainder. Sorting first lets you use two pointers and also makes deduplication easy  -  skip duplicate values of i, left, and right.',
   'Return unique triplets only | Values can be negative | Array length >= 3 | Sort first',
   'Time: O(n^2) | Space: O(1) excluding output',
   '--- All Test Cases ---
TC1: [-1,0,1,2,-1,-4]  =>  [[-1,-1,2],[-1,0,1]]
TC2: [0,0,0]  =>  [[0,0,0]]
TC3: [1,2,3]  =>  []
TC4: [-2,0,1,1,2]  =>  [[-2,0,2],[-2,1,1]]

TC1 input:
  +----+---+---+---+----+----+
  | -1 | 0 | 1 | 2 | -1 | -4 |
  +----+---+---+---+----+----+
   0    1   2   3   4    5   
TC1 output:
  +---------+--------+
  | -1,-1,2 | -1,0,1 |
  +---------+--------+
   0         1       '),

  ('tp_04',
   'Container with most water',
   'Two pointers at both ends. Area = min(height[left], height[right]) * (right - left). Always move the shorter side.',
   'medium',
   'Two Pointers',
   'Moving the taller side can never increase area. Always move the shorter pointer inward.',
   'function maxWater(heights) {
  // Step 1: left = 0, right = heights.length - 1, maxArea = 0
  // Step 2: while left < right
  //   area = Math.min(heights[left], heights[right]) * (right - left)
  //   maxArea = Math.max(maxArea, area)
  //   if heights[left] < heights[right] left++
  //   else right--
  // Step 3: return maxArea
}',
   '[{"input":[[1,8,6,2,5,4,8,3,7]],"expected":49},{"input":[[1,1]],"expected":1},{"input":[[4,3,2,1,4]],"expected":16},{"input":[[1,2,1]],"expected":2}]',
   'Water volume is limited by the shorter wall. Moving the taller wall inward can only reduce the width without improving the height constraint. Moving the shorter wall is the only chance to increase the area.',
   '2 <= heights.length <= 10^5 | 0 <= heights[i] <= 10^4',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [1,8,6,2,5,4,8,3,7]  =>  49
TC2: [1,1]  =>  1
TC3: [4,3,2,1,4]  =>  16
TC4: [1,2,1]  =>  2

TC1 input:
  +---+---+---+---+---+---+---+---+---+
  | 1 | 8 | 6 | 2 | 5 | 4 | 8 | 3 | 7 |
  +---+---+---+---+---+---+---+---+---+
   0   1   2   3   4   5   6   7   8  
TC1 output:
  49'),

  ('tp_05',
   'Trapping rain water',
   'Water at index i = min(maxLeft[i], maxRight[i]) - height[i]. Use two pointers to compute this in one pass.',
   'hard',
   'Two Pointers',
   'Track leftMax and rightMax. If leftMax < rightMax process the left side, otherwise the right.',
   'function trapWater(heights) {
  // Step 1: left = 0, right = n-1, leftMax = 0, rightMax = 0, water = 0
  // Step 2: while left < right
  //   if heights[left] < heights[right]
  //     if heights[left] >= leftMax, leftMax = heights[left]
  //     else water += leftMax - heights[left]
  //     left++
  //   else do same for right side
  // Step 3: return water
}',
   '[{"input":[[0,1,0,2,1,0,1,3,2,1,2,1]],"expected":6},{"input":[[4,2,0,3,2,5]],"expected":9},{"input":[[1,0,1]],"expected":1},{"input":[[3,0,0,2,0,4]],"expected":10}]',
   'Water trapped at each position equals the minimum of the tallest walls on its left and right, minus the current height. The two-pointer approach avoids precomputing left/right max arrays: if leftMax < rightMax, the water level at the left side is determined by leftMax.',
   '0 <= heights.length <= 3 * 10^4 | 0 <= heights[i] <= 10^5',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [0,1,0,2,1,0,1,3,... +4]  =>  6
TC2: [4,2,0,3,2,5]  =>  9
TC3: [1,0,1]  =>  1
TC4: [3,0,0,2,0,4]  =>  10

TC1:
  In:  [0,1,0,2,1,0,1,3,... +4]
  Out: 6'),

  ('sw_01',
   'Maximum sum of subarray of size k',
   'Compute the first window sum. Slide right by adding the new element and removing the leftmost.',
   'easy',
   'Sliding Window',
   'windowSum = windowSum + arr[right] - arr[right - k]. Track max.',
   'function maxSubarrayOfSizeK(arr, k) {
  // Step 1: compute sum of first window arr[0..k-1]
  // Step 2: slide window from index k to end
  //   add arr[right], subtract arr[right-k]
  //   update maxSum
  // Step 3: return maxSum
}',
   '[{"input":[[2,1,5,1,3,2],3],"expected":9},{"input":[[1,2,3,4,5],2],"expected":9},{"input":[[1,1,1,1],2],"expected":2},{"input":[[5],1],"expected":5}]',
   'Instead of recomputing the sum of every k-element window from scratch, slide the window forward by adding the new right element and subtracting the old left element. This turns O(n*k) into O(n).',
   '1 <= k <= arr.length | arr.length >= 1 | Values can be any integer',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [2,1,5,1,3,2], 3  =>  9
TC2: [1,2,3,4,5], 2  =>  9
TC3: [1,1,1,1], 2  =>  2
TC4: [5], 1  =>  5

TC1 input:
  +---+---+---+---+---+---+
  | 2 | 1 | 5 | 1 | 3 | 2 |
  +---+---+---+---+---+---+
   0   1   2   3   4   5  
  arg2: 3
TC1 output:
  9'),

  ('sw_02',
   'Smallest subarray with sum >= target',
   'Expand right to grow the window. Shrink left whenever the sum meets or exceeds target.',
   'easy',
   'Sliding Window',
   'While windowSum >= target, update minLen and shrink: windowSum -= arr[left], left++.',
   'function minSubarrayLen(arr, target) {
  // Step 1: left = 0, windowSum = 0, minLen = Infinity
  // Step 2: for right from 0 to n-1
  //   windowSum += arr[right]
  //   while windowSum >= target
  //     minLen = Math.min(minLen, right - left + 1)
  //     windowSum -= arr[left++]
  // Step 3: return minLen === Infinity ? 0 : minLen
}',
   '[{"input":[[2,3,1,2,4,3],7],"expected":2},{"input":[[1,4,4],4],"expected":1},{"input":[[1,1,1,1,1,1,1,1],11],"expected":0},{"input":[[1,2,3,4,5],15],"expected":5}]',
   'Variable-size sliding window. Expand by adding arr[right]. Whenever the sum is sufficient, try shrinking from the left to find the minimum length window. The inner while loop does at most O(n) total work across all iterations.',
   '1 <= arr.length <= 10^5 | 1 <= target | Values are positive (required for sliding window correctness) | Return 0 if impossible',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: [2,3,1,2,4,3], 7  =>  2
TC2: [1,4,4], 4  =>  1
TC3: [1,1,1,1,1,1,1,1], 11  =>  0
TC4: [1,2,3,4,5], 15  =>  5

TC1 input:
  +---+---+---+---+---+---+
  | 2 | 3 | 1 | 2 | 4 | 3 |
  +---+---+---+---+---+---+
   0   1   2   3   4   5  
  arg2: 7
TC1 output:
  2'),

  ('sw_03',
   'Longest substring with at most k distinct characters',
   'Expand right, track character frequencies in a map. When distinct count exceeds k, shrink left.',
   'medium',
   'Sliding Window',
   'When freq map size > k, decrement freq[arr[left]] and delete if zero, then left++.',
   'function longestKDistinct(s, k) {
  // Step 1: left = 0, freq = {}, best = 0
  // Step 2: for right from 0 to n-1
  //   add s[right] to freq map
  //   while freq map size > k
  //     decrement freq[s[left]], delete if zero, left++
  //   best = Math.max(best, right - left + 1)
  // Step 3: return best
}',
   '[{"input":["eceba",2],"expected":3},{"input":["aa",1],"expected":2},{"input":["aabbcc",2],"expected":4},{"input":["abc",3],"expected":3}]',
   'The frequency map tracks how many of each character are in the current window. When distinct character count exceeds k, shrink from the left until it is at most k again. The longest such window is the answer.',
   '1 <= s.length <= 5 * 10^4 | 1 <= k <= 26 | Lowercase letters | k >= s distinct chars means entire string',
   'Time: O(n) | Space: O(k)',
   '--- All Test Cases ---
TC1: "eceba", 2  =>  3
TC2: "aa", 1  =>  2
TC3: "aabbcc", 2  =>  4
TC4: "abc", 3  =>  3

TC1:
  In:  "eceba", 2
  Out: 3'),

  ('sw_04',
   'Find all anagrams in a string',
   'Use a fixed-size window of length p. Compare character frequencies of window vs pattern.',
   'medium',
   'Sliding Window',
   'Build freq maps for p and the first window. Slide and update  -  add right char, remove left char.',
   'function findAnagrams(s, p) {
  // Step 1: build pFreq from p, wFreq from s[0..p.length-1]
  // Step 2: compare  -  if equal add 0 to result
  // Step 3: slide window: add s[right], remove s[left]
  //   update wFreq and compare each step
  // Step 4: return result (start indices)
}',
   '[{"input":["cbaebabacd","abc"],"expected":[0,6]},{"input":["abab","ab"],"expected":[0,1,2]},{"input":["aa","bb"],"expected":[]},{"input":["baa","aa"],"expected":[1]}]',
   'A fixed window of size p slides across s. At each position, compare the window''s character frequencies to p''s frequencies. Comparing two 26-element arrays is O(1) per slide. Record the start index whenever they match.',
   '1 <= s.length, p.length <= 3 * 10^4 | Lowercase letters | p.length <= s.length',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: "cbaebabacd", "abc"  =>  [0,6]
TC2: "abab", "ab"  =>  [0,1,2]
TC3: "aa", "bb"  =>  []
TC4: "baa", "aa"  =>  [1]

TC1:
  In:  "cbaebabacd", "abc"
  Out: [0,6]'),

  ('sw_05',
   'Longest repeating character replacement',
   'Window is valid if (windowSize - maxFreq) <= k. Expand right, shrink left when invalid.',
   'hard',
   'Sliding Window',
   'Track maxFreq of any character in the window. If windowLen - maxFreq > k, move left.',
   'function characterReplacement(s, k) {
  // Step 1: left = 0, freq = {}, maxFreq = 0, best = 0
  // Step 2: for right from 0 to n-1
  //   freq[s[right]]++, maxFreq = Math.max(maxFreq, freq[s[right]])
  //   while (right - left + 1) - maxFreq > k, freq[s[left]]--, left++
  //   best = Math.max(best, right - left + 1)
  // Step 3: return best
}',
   '[{"input":["AABABBA",1],"expected":4},{"input":["ABAB",2],"expected":4},{"input":["AAAA",0],"expected":4},{"input":["ABCDE",1],"expected":2}]',
   'The key insight: in a window, the minimum replacements needed = windowSize - count of the most frequent character. If this exceeds k, the window is too large. Shrink from the left until it is valid again.',
   '1 <= s.length <= 10^5 | Uppercase English letters only | 0 <= k <= s.length',
   'Time: O(n) | Space: O(1)',
   '--- All Test Cases ---
TC1: "AABABBA", 1  =>  4
TC2: "ABAB", 2  =>  4
TC3: "AAAA", 0  =>  4
TC4: "ABCDE", 1  =>  2

TC1:
  In:  "AABABBA", 1
  Out: 4'),

  ('hash_01',
   'Two sum  -  find indices',
   'For each number, check if (target - num) already exists in the map. If yes, you found the pair.',
   'easy',
   'Hashing',
   'Store {value: index} in the map. For each element check if target - arr[i] is in the map.',
   'function twoSum(arr, target) {
  // Step 1: create empty map
  // Step 2: for each element, compute complement = target - arr[i]
  // Step 3: if complement exists in map, return [map[complement], i]
  // Step 4: else store map[arr[i]] = i
  // Step 5: return [] if not found
}',
   '[{"input":[[2,7,11,15],9],"expected":[0,1]},{"input":[[3,2,4],6],"expected":[1,2]},{"input":[[3,3],6],"expected":[0,1]},{"input":[[1,2,3,4],7],"expected":[2,3]}]',
   'Store each number''s index as you scan. For each new number, check if its complement (target - num) is already in the map. O(1) map lookup means you find the answer in a single pass.',
   '2 <= arr.length <= 10^4 | Exactly one solution guaranteed | Elements can repeat (use indices not values as answer)',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: [2,7,11,15], 9  =>  [0,1]
TC2: [3,2,4], 6  =>  [1,2]
TC3: [3,3], 6  =>  [0,1]
TC4: [1,2,3,4], 7  =>  [2,3]

TC1 input:
  +---+---+----+----+
  | 2 | 7 | 11 | 15 |
  +---+---+----+----+
   0   1   2    3   
  arg2: 9
TC1 output:
  +---+---+
  | 0 | 1 |
  +---+---+
   0   1  '),

  ('hash_02',
   'Group anagrams together',
   'Sort each word as a key. Group words with the same sorted key into the same bucket.',
   'easy',
   'Hashing',
   'key = word.split('''').sort().join(''''). map[key] = map[key] || []. map[key].push(word).',
   'function groupAnagrams(words) {
  // Step 1: create empty map
  // Step 2: for each word, compute key = sorted characters
  // Step 3: push word into map[key] bucket
  // Step 4: return Object.values(map)
}',
   '[{"input":[["eat","tea","tan","ate","nat","bat"]],"expected":[["eat","tea","ate"],["tan","nat"],["bat"]]},{"input":[[""]],"expected":[[""]]},{"input":[["a"]],"expected":[["a"]]}]',
   'Two words are anagrams if and only if they have the same characters in the same frequencies. A sorted version of the word is a canonical key that all anagrams share. Group by that key.',
   '1 <= words.length <= 10^4 | 0 <= word.length <= 100 | Lowercase letters only',
   'Time: O(n * L log L) where L = max word length | Space: O(n * L)',
   '--- All Test Cases ---
TC1: ["eat","tea","tan","ate","nat","bat"]  =>  [["eat","tea","ate"],["tan","nat"],["bat"]]
TC2: [""]  =>  [[""]]
TC3: ["a"]  =>  [["a"]]

TC1 input:
  +-----+-----+-----+-----+-----+-----+
  | eat | tea | tan | ate | nat | bat |
  +-----+-----+-----+-----+-----+-----+
   0     1     2     3     4     5    
TC1 output:
  +-------------+---------+-----+
  | eat,tea,ate | tan,nat | bat |
  +-------------+---------+-----+
   0             1         2    '),

  ('hash_03',
   'Longest consecutive sequence',
   'Add all numbers to a set. For each number that has no left neighbour (n-1 not in set), count how far the sequence extends.',
   'medium',
   'Hashing',
   'Only start counting from a sequence start (n-1 not in set). Count n+1, n+2 etc.',
   'function longestConsecutive(nums) {
  // Step 1: add all nums to a Set
  // Step 2: for each num, if num-1 is NOT in set, it is a sequence start
  // Step 3: count streak: while num+streak is in set, streak++
  // Step 4: best = Math.max(best, streak)
  // Step 5: return best
}',
   '[{"input":[[100,4,200,1,3,2]],"expected":4},{"input":[[0,3,7,2,5,8,4,6,0,1]],"expected":9},{"input":[[1]],"expected":1},{"input":[[1,2,0,1]],"expected":3}]',
   'Only start counting a sequence from its leftmost element (where n-1 is not in the set). This prevents double-counting. Set lookup is O(1), so each element is visited at most twice  -  once as a start check, once as part of a streak.',
   '0 <= nums.length <= 10^5 | Values can be any integer | Duplicates are ignored (use a set)',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: [100,4,200,1,3,2]  =>  4
TC2: [0,3,7,2,5,8,4,6,0,1]  =>  9
TC3: [1]  =>  1
TC4: [1,2,0,1]  =>  3

TC1 input:
  +-----+---+-----+---+---+---+
  | 100 | 4 | 200 | 1 | 3 | 2 |
  +-----+---+-----+---+---+---+
   0     1   2     3   4   5  
TC1 output:
  4'),

  ('hash_04',
   'Subarray sum equals k',
   'Use a prefix sum map. For each running sum, check if (sum - k) exists in the map.',
   'medium',
   'Hashing',
   'prefixMap[0] = 1. For each sum, count += prefixMap[sum - k]. Then prefixMap[sum]++.',
   'function subarraySum(arr, k) {
  // Step 1: prefixMap = {0: 1}, sum = 0, count = 0
  // Step 2: for each element
  //   sum += arr[i]
  //   count += prefixMap[sum - k] || 0
  //   prefixMap[sum] = (prefixMap[sum] || 0) + 1
  // Step 3: return count
}',
   '[{"input":[[1,1,1],2],"expected":2},{"input":[[1,2,3],3],"expected":2},{"input":[[1],1],"expected":1},{"input":[[-1,1,0],0],"expected":3}]',
   'Prefix sum trick: prefixSum[j] - prefixSum[i] = sum of subarray arr[i+1..j]. So if we are looking for a subarray summing to k, we need prefixSum[j] - k to have appeared before. The map stores how many times each prefix sum has occurred.',
   'Array can have negative values | 1 <= arr.length <= 2 * 10^4 | Count all subarrays, including overlapping ones',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: [1,1,1], 2  =>  2
TC2: [1,2,3], 3  =>  2
TC3: [1], 1  =>  1
TC4: [-1,1,0], 0  =>  3

TC1 input:
  +---+---+---+
  | 1 | 1 | 1 |
  +---+---+---+
   0   1   2  
  arg2: 2
TC1 output:
  2'),

  ('hash_05',
   'Find duplicate in array',
   'Add elements to a set one by one. Return the first element already in the set.',
   'easy',
   'Hashing',
   'if (seen.has(arr[i])) return arr[i]. else seen.add(arr[i]).',
   'function findDuplicate(arr) {
  // Step 1: create empty Set
  // Step 2: for each element
  //   if already in set, return it
  //   else add to set
  // Step 3: return -1 if no duplicate
}',
   '[{"input":[[1,3,4,2,2]],"expected":2},{"input":[[3,1,3,4,2]],"expected":3},{"input":[[1,1]],"expected":1},{"input":[[1,2,3,4,5,6,3]],"expected":3}]',
   'A set gives O(1) membership check. Walk the array once, checking each element against the set before adding it. The first element found already in the set is the first duplicate.',
   '1 <= arr.length <= 10^5 | Return first duplicate found in order of traversal | Return -1 if none',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: [1,3,4,2,2]  =>  2
TC2: [3,1,3,4,2]  =>  3
TC3: [1,1]  =>  1
TC4: [1,2,3,4,5,6,3]  =>  3

TC1 input:
  +---+---+---+---+---+
  | 1 | 3 | 4 | 2 | 2 |
  +---+---+---+---+---+
   0   1   2   3   4  
TC1 output:
  2'),

  ('math_01',
   'Check if a number is prime',
   'Check divisibility up to the square root of n. If any divisor found, not prime.',
   'easy',
   'Math & Basic Problems',
   'Loop i from 2 to Math.sqrt(n). If n % i === 0, return false.',
   'function isPrime(n) {
  // Edge cases: n < 2 is not prime
  // Loop i from 2 to Math.sqrt(n)
  // If n % i === 0, return false
  // Return true
}',
   '[{"input":[2],"expected":true},{"input":[1],"expected":false},{"input":[17],"expected":true},{"input":[12],"expected":false}]',
   'If n has a factor larger than its square root, it must also have one smaller than its square root. So checking up to sqrt(n) is sufficient. Edge cases: 0 and 1 are not prime by definition.',
   '1 <= n <= 10^6 | n=1 is not prime | n=2 is the smallest prime',
   'Time: O(sqrt(n)) | Space: O(1)',
   '--- All Test Cases ---
TC1: 2  =>  true
TC2: 1  =>  false
TC3: 17  =>  true
TC4: 12  =>  false

TC1:
  In:  2
  Out: true'),

  ('math_02',
   'GCD using Euclidean algorithm',
   'GCD(a, b) = GCD(b, a % b). Base case is GCD(a, 0) = a.',
   'easy',
   'Math & Basic Problems',
   'Keep replacing (a, b) with (b, a % b) until b becomes 0.',
   'function gcd(a, b) {
  // Base case: b === 0, return a
  // Recursive case: return gcd(b, a % b)
}',
   '[{"input":[48,18],"expected":6},{"input":[7,3],"expected":1},{"input":[100,75],"expected":25},{"input":[12,12],"expected":12}]',
   'The Euclidean algorithm: GCD doesn''t change when you replace the larger number with its remainder when divided by the smaller. Repeat until the remainder is 0  -  the non-zero number is the GCD. Very efficient, logarithmic in the smaller number.',
   'Both a and b are positive integers | GCD(n, n) = n | GCD(a, 0) = a by definition',
   'Time: O(log(min(a,b))) | Space: O(log(min(a,b))) recursive',
   '--- All Test Cases ---
TC1: 48, 18  =>  6
TC2: 7, 3  =>  1
TC3: 100, 75  =>  25
TC4: 12, 12  =>  12

TC1:
  In:  48, 18
  Out: 6'),

  ('math_03',
   'Reverse digits of an integer',
   'Extract digits using modulo and build the reversed number by multiplying by 10 each step.',
   'easy',
   'Math & Basic Problems',
   'reversed = reversed * 10 + n % 10. n = Math.floor(n / 10).',
   'function reverseInt(n) {
  // Step 1: reversed = 0
  // Step 2: while n > 0
  //   reversed = reversed * 10 + n % 10
  //   n = Math.floor(n / 10)
  // Step 3: return reversed
}',
   '[{"input":[123],"expected":321},{"input":[120],"expected":21},{"input":[1],"expected":1},{"input":[1000],"expected":1}]',
   'n % 10 extracts the last digit. Multiply the running result by 10 (shift left) and add the new digit. Math.floor(n/10) drops the last digit. Leading zeros in the reversed number (like 120 -> 021) are dropped automatically.',
   'Input is a non-negative integer | Leading zeros in result are dropped (120 reverses to 21) | Consider overflow for very large numbers',
   'Time: O(log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: 123  =>  321
TC2: 120  =>  21
TC3: 1  =>  1
TC4: 1000  =>  1

TC1:
  In:  123
  Out: 321'),

  ('math_04',
   'Count set bits in a number',
   'Check the last bit with n & 1. Right-shift n by 1 each step until n becomes 0.',
   'medium',
   'Math & Basic Problems',
   'count += n & 1. n = n >> 1. Repeat until n === 0.',
   'function countSetBits(n) {
  // Step 1: count = 0
  // Step 2: while n > 0
  //   count += n & 1  (check last bit)
  //   n = n >> 1      (shift right)
  // Step 3: return count
}',
   '[{"input":[5],"expected":2},{"input":[7],"expected":3},{"input":[0],"expected":0},{"input":[255],"expected":8}]',
   'n & 1 isolates the last bit (0 or 1). Right-shifting by 1 moves to the next bit. Count all 1-bits this way. n=5 is binary 101  -  two set bits.',
   '0 <= n <= 2^31 - 1 | n=0 returns 0 | n=255 (11111111 in binary) returns 8',
   'Time: O(log n) | Space: O(1)',
   '--- All Test Cases ---
TC1: 5  =>  2
TC2: 7  =>  3
TC3: 0  =>  0
TC4: 255  =>  8

TC1:
  In:  5
  Out: 2'),

  ('math_05',
   'FizzBuzz',
   'For each number 1 to n, print Fizz if divisible by 3, Buzz if by 5, FizzBuzz if both, else the number.',
   'easy',
   'Math & Basic Problems',
   'Check divisible by 15 first (both), then 3, then 5, else the number itself.',
   'function fizzBuzz(n) {
  const result = [];
  // For i from 1 to n:
  //   if i % 15 === 0, push ''FizzBuzz''
  //   else if i % 3 === 0, push ''Fizz''
  //   else if i % 5 === 0, push ''Buzz''
  //   else push String(i)
  return result;
}',
   '[{"input":[5],"expected":["1","2","Fizz","4","Buzz"]},{"input":[15],"expected":["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]},{"input":[1],"expected":["1"]},{"input":[3],"expected":["1","2","Fizz"]}]',
   'Always check for divisibility by 15 (both 3 and 5) first. If you check 3 first and push "Fizz", you miss the "FizzBuzz" case. This order of checks is the key.',
   '1 <= n <= 10^4 | Return strings, not numbers | FizzBuzz check must come before Fizz and Buzz checks',
   'Time: O(n) | Space: O(n)',
   '--- All Test Cases ---
TC1: 5  =>  ["1","2","Fizz","4","Buzz"]
TC2: 15  =>  ["1","2","Fizz","4","Buzz","Fizz","7","8",... +7]
TC3: 1  =>  ["1"]
TC4: 3  =>  ["1","2","Fizz"]

TC1:
  In:  5
  Out: ["1","2","Fizz","4","Buzz"]'),

  ('graph_01',
   'BFS on a graph',
   'Start from a source node. Use a queue  -  visit all neighbours before going deeper.',
   'easy',
   'Graphs',
   'Enqueue source. While queue not empty, dequeue, visit, enqueue unvisited neighbours.',
   'function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    // Dequeue front node
    // Push to order
    // For each neighbour: if not visited, mark visited and enqueue
  }
  return order;
}',
   '[{"input":[{"0":["1","2"],"1":["3"],"2":["3"],"3":[]},"0"],"expected":["0","1","2","3"]},{"input":[{"0":["1"],"1":["2"],"2":[]},"0"],"expected":["0","1","2"]},{"input":[{"0":[]},"0"],"expected":["0"]}]',
   'BFS explores level by level using a queue. First visit the start node, then all its neighbours, then all their neighbours, and so on. The visited set prevents revisiting nodes in cyclic graphs.',
   'Graph is given as adjacency list | May be disconnected | Nodes are strings or numbers',
   'Time: O(V + E) | Space: O(V)',
   '--- All Test Cases ---
TC1: {4 nodes}, "0"  =>  ["0","1","2","3"]
TC2: {3 nodes}, "0"  =>  ["0","1","2"]
TC3: {1 nodes}, "0"  =>  ["0"]

TC1 graph:
  Edges: 0--1, 0--2, 1--3, 2--3
  Args:  "0"
  Out:   ["0","1","2","3"]'),

  ('graph_02',
   'DFS on a graph',
   'Start from a source node. Go as deep as possible before backtracking.',
   'easy',
   'Graphs',
   'Mark node visited, push to order. For each unvisited neighbour, recurse.',
   'function dfs(graph, start) {
  const visited = new Set();
  const order = [];
  function explore(node) {
    // Mark visited, push to order
    // For each neighbour of node: if not visited, recurse
  }
  explore(start);
  return order;
}',
   '[{"input":[{"0":["1","2"],"1":["3"],"2":["4"],"3":[],"4":[]},"0"],"expected":["0","1","3","2","4"]},{"input":[{"0":["1"],"1":[]},"0"],"expected":["0","1"]},{"input":[{"0":[]},"0"],"expected":["0"]}]',
   'DFS goes as deep as possible along each branch before backtracking. Uses the call stack (or an explicit stack) instead of a queue. Explores one path fully before trying alternatives.',
   'Graph is given as adjacency list | Recursion depth limited by node count | Order depends on neighbour ordering',
   'Time: O(V + E) | Space: O(V)',
   '--- All Test Cases ---
TC1: {5 nodes}, "0"  =>  ["0","1","3","2","4"]
TC2: {2 nodes}, "0"  =>  ["0","1"]
TC3: {1 nodes}, "0"  =>  ["0"]

TC1 graph:
  Edges: 0--1, 0--2, 1--3, 2--4
  Args:  "0"
  Out:   ["0","1","3","2","4"]'),

  ('graph_03',
   'Number of islands',
   'For each unvisited land cell, run DFS to mark the whole island as visited. Count how many DFS calls you make.',
   'medium',
   'Graphs',
   'When you hit a ''1'', increment count and DFS in all 4 directions marking ''0'' as you go.',
   'function numIslands(grid) {
  let count = 0;
  function dfs(r, c) {
    // If out of bounds or grid[r][c] === ''0'', return
    // Mark grid[r][c] = ''0''
    // DFS in all 4 directions
  }
  // For each cell, if ''1'', count++ and dfs(r, c)
  return count;
}',
   '[{"input":[[["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]]],"expected":3},{"input":[[["1","1","1"],["0","1","0"],["1","1","1"]]],"expected":1},{"input":[[["0"]]],"expected":0},{"input":[[["1"]]],"expected":1}]',
   'Think of the grid as a graph where land cells ("1") are nodes connected in 4 directions. Each DFS from an unvisited land cell marks all cells of one island as visited ("0"). Count how many DFS calls you initiate.',
   'Grid contains only "0" and "1" | Islands are surrounded by water or grid edges | Diagonal connections do not count',
   'Time: O(rows * cols) | Space: O(rows * cols) recursion stack',
   '--- All Test Cases ---
TC1: [["1","1","0","0"],["1","1","0","0"],["0","0","1","0"],["0","0","0","1"]]  =>  3
TC2: [["1","1","1"],["0","1","0"],["1","1","1"]]  =>  1
TC3: [["0"]]  =>  0
TC4: [["1"]]  =>  1

TC1 graph:
  Out:   3'),

  ('graph_04',
   'Detect cycle in undirected graph',
   'Use BFS or DFS. Track the parent of each node. If you visit a neighbour that is visited and not the parent, there is a cycle.',
   'medium',
   'Graphs',
   'In DFS: if neighbour is visited and neighbour !== parent, cycle detected.',
   'function hasCycle(graph, n) {
  const visited = new Set();
  function dfs(node, parent) {
    // Mark visited
    // For each neighbour:
    //   if not visited, recurse  -  if it returns true, return true
    //   if visited and neighbour !== parent, return true (cycle)
    // Return false
  }
  // Run dfs from each unvisited node
  return false;
}',
   '[{"input":[{"0":["1","2"],"1":["0","2"],"2":["0","1"]},3],"expected":true},{"input":[{"0":["1"],"1":["0","2"],"2":["1"]},3],"expected":false},{"input":[{"0":["1"],"1":["0"]},2],"expected":false}]',
   'In undirected graphs, every edge appears in both directions. Ignore the edge back to the parent  -  that is not a cycle. If you reach an already-visited neighbour that is NOT the parent, you have found a back edge (cycle).',
   'Graph may be disconnected (check all unvisited nodes) | Undirected (each edge is bidirectional) | No self-loops assumed',
   'Time: O(V + E) | Space: O(V)',
   '--- All Test Cases ---
TC1: {3 nodes}, 3  =>  true
TC2: {3 nodes}, 3  =>  false
TC3: {2 nodes}, 2  =>  false

TC1 graph:
  Edges: 0--1, 0--2, 1--0, 1--2, 2--0, 2--1
  Args:  3
  Out:   true'),

  ('graph_05',
   'Shortest path in unweighted graph  -  BFS',
   'BFS guarantees shortest path in an unweighted graph. Track distance from source to each node.',
   'hard',
   'Graphs',
   'dist[start] = 0. When visiting a neighbour, dist[neighbour] = dist[node] + 1.',
   'function shortestPath(graph, start, end) {
  const dist = {};
  dist[start] = 0;
  const queue = [start];
  while (queue.length > 0) {
    // Dequeue node
    // For each neighbour: if dist not set, dist[neighbour] = dist[node]+1, enqueue
  }
  return dist[end] !== undefined ? dist[end] : -1;
}',
   '[{"input":[{"0":["1","2"],"1":["0","3"],"2":["0","3"],"3":["1","2"]},"0","3"],"expected":2},{"input":[{"0":["1"],"1":["2"],"2":[]},"0","2"],"expected":2},{"input":[{"0":["1"],"1":[]},"0","2"],"expected":-1}]',
   'BFS explores nodes in order of distance from the source (1 hop, then 2 hops, etc.). The first time you reach the destination, that is guaranteed to be the shortest path in an unweighted graph. Track distances with a map.',
   'Graph may be disconnected | Return -1 if no path exists | All edges have equal weight (unweighted)',
   'Time: O(V + E) | Space: O(V)',
   '--- All Test Cases ---
TC1: {4 nodes}, "0", "3"  =>  2
TC2: {3 nodes}, "0", "2"  =>  2
TC3: {2 nodes}, "0", "2"  =>  -1

TC1 graph:
  Edges: 0--1, 0--2, 1--0, 1--3, 2--0, 2--3, 3--1, 3--2
  Args:  "0", "3"
  Out:   2');
