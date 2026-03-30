/**
 * DSA question bank — generated from insert_questions.sql (109 questions).
 * Do not edit by hand; regenerate with: node scripts/generate-questions.mjs [path-to.sql]
 */

export type QuestionLevel = "easy" | "medium" | "hard";

export type Question = {
  id: string;
  title: string;
  description: string;
  level: QuestionLevel;
  tag: string;
  hint: string | null;
  boilerplate: string;
  /** Raw JSON string of test cases (array of objects) */
  test_cases: string;
};

export const QUESTIONS: Question[] = [
    {
      id: "arr_01",
      title: "Find the maximum element",
      description: "Walk through the array and track the largest value seen so far. No sorting allowed.",
      level: "easy" as QuestionLevel,
      tag: "Arrays",
      hint: "Use a variable to store the current max. Update it whenever you find something bigger.",
      boilerplate: `function findMax(arr) {
  // Step 1: assume the first element is the max
  // Step 2: loop through the rest
  // Step 3: update max whenever you find a bigger value
  // Step 4: return max
}`,
      test_cases: "[{\"input\":[[3,1,4,1,5,9]],\"expected\":9},{\"input\":[[1]],\"expected\":1},{\"input\":[[-3,-1,-4]],\"expected\":-1},{\"input\":[[7,7,7]],\"expected\":7}]",
    },
    {
      id: "arr_02",
      title: "Reverse an array in-place",
      description: "Use two pointers from both ends and swap inward until they meet. Do not create a new array.",
      level: "easy" as QuestionLevel,
      tag: "Arrays",
      hint: "Left pointer starts at 0, right pointer starts at arr.length - 1. Swap and move both inward.",
      boilerplate: `function reverseArray(arr) {
  // Step 1: set left = 0, right = arr.length - 1
  // Step 2: while left < right, swap arr[left] and arr[right]
  // Step 3: move left++ and right--
  // Step 4: return arr
}`,
      test_cases: "[{\"input\":[[1,2,3,4,5]],\"expected\":[5,4,3,2,1]},{\"input\":[[1,2]],\"expected\":[2,1]},{\"input\":[[42]],\"expected\":[42]},{\"input\":[[-1,0,1]],\"expected\":[1,0,-1]}]",
    },
    {
      id: "arr_03",
      title: "Check if array is sorted",
      description: "Traverse once and return false the moment you find an out-of-order pair.",
      level: "easy" as QuestionLevel,
      tag: "Arrays",
      hint: "Compare arr[i] with arr[i+1]. If arr[i] > arr[i+1], it is not sorted.",
      boilerplate: `function isSorted(arr) {
  // Step 1: loop from index 0 to arr.length - 2
  // Step 2: if arr[i] > arr[i+1], return false immediately
  // Step 3: if loop completes, return true
}`,
      test_cases: "[{\"input\":[[1,2,3,4,5]],\"expected\":true},{\"input\":[[1,3,2,4]],\"expected\":false},{\"input\":[[5]],\"expected\":true},{\"input\":[[1,1,1]],\"expected\":true}]",
    },
    {
      id: "arr_04",
      title: "Move all zeros to the end",
      description: "Place non-zero elements first using a write pointer, then fill the rest with zeros.",
      level: "medium" as QuestionLevel,
      tag: "Arrays",
      hint: "writePtr starts at 0. For each non-zero element, place it at writePtr and advance. Then fill remaining positions with 0.",
      boilerplate: `function moveZeros(arr) {
  // Step 1: create a writePtr = 0
  // Step 2: loop through arr, for each non-zero element place it at arr[writePtr] and increment writePtr
  // Step 3: fill the rest of arr with zeros from writePtr onwards
  // Step 4: return arr
}`,
      test_cases: "[{\"input\":[[0,1,0,3,12]],\"expected\":[1,3,12,0,0]},{\"input\":[[0,0,0]],\"expected\":[0,0,0]},{\"input\":[[1,2,3]],\"expected\":[1,2,3]},{\"input\":[[0]],\"expected\":[0]}]",
    },
    {
      id: "arr_05",
      title: "Find pair with target sum",
      description: "Use two pointers on a sorted array — move them inward based on the current sum compared to target.",
      level: "medium" as QuestionLevel,
      tag: "Arrays",
      hint: "If sum < target move left right. If sum > target move right left. Return indices when equal.",
      boilerplate: `function findPair(arr, target) {
  // Step 1: sort arr first (or assume sorted)
  // Step 2: set left = 0, right = arr.length - 1
  // Step 3: compute sum = arr[left] + arr[right]
  // Step 4: if sum === target return [left, right]
  // Step 5: if sum < target, left++. if sum > target, right--
  // Step 6: return [] if not found
}`,
      test_cases: "[{\"input\":[[1,2,3,4,6],6],\"expected\":[1,3]},{\"input\":[[1,2,3,4,6],10],\"expected\":[3,4]},{\"input\":[[1,2,3],7],\"expected\":[]},{\"input\":[[1,5],6],\"expected\":[0,1]}]",
    },
    {
      id: "arr_06",
      title: "Maximum subarray sum",
      description: "Kadane's algorithm — carry forward a running sum and reset when it goes negative.",
      level: "medium" as QuestionLevel,
      tag: "Arrays",
      hint: "curr = max(arr[i], curr + arr[i]). Update best whenever curr is larger.",
      boilerplate: `function maxSubarraySum(arr) {
  // Step 1: set curr = arr[0], best = arr[0]
  // Step 2: loop from index 1
  // Step 3: curr = Math.max(arr[i], curr + arr[i])
  // Step 4: best = Math.max(best, curr)
  // Step 5: return best
}`,
      test_cases: "[{\"input\":[[-2,1,-3,4,-1,2,1,-5,4]],\"expected\":6},{\"input\":[[1]],\"expected\":1},{\"input\":[[-1,-2,-3]],\"expected\":-1},{\"input\":[[5,4,-1,7,8]],\"expected\":23}]",
    },
    {
      id: "arr_07",
      title: "Rotate array by k steps",
      description: "Reverse the whole array, then reverse the first k and the remaining n-k elements separately.",
      level: "hard" as QuestionLevel,
      tag: "Arrays",
      hint: "Three reversal trick. Normalize k = k % n first to handle k larger than array length.",
      boilerplate: `function rotateArray(arr, k) {
  // Step 1: normalize k = k % arr.length
  // Step 2: reverse the entire array
  // Step 3: reverse arr[0..k-1]
  // Step 4: reverse arr[k..n-1]
  // Helper: write a reverse(arr, start, end) function
}`,
      test_cases: "[{\"input\":[[1,2,3,4,5,6,7],3],\"expected\":[5,6,7,1,2,3,4]},{\"input\":[[-1,-100,3,99],2],\"expected\":[3,99,-1,-100]},{\"input\":[[1,2],1],\"expected\":[2,1]},{\"input\":[[1,2,3],3],\"expected\":[1,2,3]}]",
    },
    {
      id: "arr_08",
      title: "Merge two sorted arrays",
      description: "Use three pointers — one per input array and one for output — and pick the smaller element each step.",
      level: "medium" as QuestionLevel,
      tag: "Arrays",
      hint: "Compare arr1[i] and arr2[j]. Push the smaller one to result and advance that pointer.",
      boilerplate: `function mergeSorted(arr1, arr2) {
  // Step 1: create result = [], i = 0, j = 0
  // Step 2: while both arrays have elements, push the smaller one
  // Step 3: push remaining elements from arr1 or arr2
  // Step 4: return result
}`,
      test_cases: "[{\"input\":[[1,3,5],[2,4,6]],\"expected\":[1,2,3,4,5,6]},{\"input\":[[],[1,2]],\"expected\":[1,2]},{\"input\":[[1],[]],\"expected\":[1]},{\"input\":[[1,2,3],[4,5,6]],\"expected\":[1,2,3,4,5,6]}]",
    },
    {
      id: "ll_01",
      title: "Insert node at head",
      description: "Create a new node, point its next to the current head, update head.",
      level: "easy" as QuestionLevel,
      tag: "Linked List",
      hint: "newNode.next = head. head = newNode.",
      boilerplate: `class ListNode {
  constructor(val) { this.val = val; this.next = null; }
}

function insertAtHead(head, val) {
  // Step 1: create newNode with val
  // Step 2: newNode.next = head
  // Step 3: return newNode as new head
}`,
      test_cases: "[{\"input\":[null,1],\"expected\":[1]},{\"input\":[[1,2,3],0],\"expected\":[0,1,2,3]}]",
    },
    {
      id: "ll_02",
      title: "Find length of linked list",
      description: "Walk node by node, increment a counter until you hit null.",
      level: "easy" as QuestionLevel,
      tag: "Linked List",
      hint: "Start count at 0. Move curr = curr.next each step. Stop when curr is null.",
      boilerplate: `function listLength(head) {
  // Step 1: set count = 0, curr = head
  // Step 2: while curr is not null, count++ and curr = curr.next
  // Step 3: return count
}`,
      test_cases: "[{\"input\":[[1,2,3,4]],\"expected\":4},{\"input\":[[1]],\"expected\":1},{\"input\":[null],\"expected\":0}]",
    },
    {
      id: "ll_03",
      title: "Delete a node by value",
      description: "Traverse with a prev pointer. Unlink the target node by rewiring the next pointer.",
      level: "easy" as QuestionLevel,
      tag: "Linked List",
      hint: "When curr.val === target, set prev.next = curr.next. Handle head deletion separately.",
      boilerplate: `function deleteNode(head, val) {
  // Step 1: handle if head.val === val, return head.next
  // Step 2: traverse with prev and curr
  // Step 3: when curr.val === val, set prev.next = curr.next
  // Step 4: return head
}`,
      test_cases: "[{\"input\":[[1,2,3,4],3],\"expected\":[1,2,4]},{\"input\":[[1,2,3],1],\"expected\":[2,3]},{\"input\":[[1],1],\"expected\":[]}]",
    },
    {
      id: "ll_04",
      title: "Reverse a linked list",
      description: "Use three pointers: prev, curr, next. Flip the next pointer at each step.",
      level: "medium" as QuestionLevel,
      tag: "Linked List",
      hint: "Save next = curr.next. Set curr.next = prev. Move prev = curr, curr = next.",
      boilerplate: `function reverseList(head) {
  // Step 1: set prev = null, curr = head
  // Step 2: while curr is not null:
  //   save next = curr.next
  //   curr.next = prev
  //   prev = curr
  //   curr = next
  // Step 3: return prev as new head
}`,
      test_cases: "[{\"input\":[[1,2,3,4,5]],\"expected\":[5,4,3,2,1]},{\"input\":[[1,2]],\"expected\":[2,1]},{\"input\":[[1]],\"expected\":[1]}]",
    },
    {
      id: "ll_05",
      title: "Find the middle node",
      description: "Slow pointer moves one step, fast moves two. When fast hits the end, slow is at the middle.",
      level: "medium" as QuestionLevel,
      tag: "Linked List",
      hint: "While fast and fast.next exist, slow = slow.next, fast = fast.next.next.",
      boilerplate: `function findMiddle(head) {
  // Step 1: set slow = head, fast = head
  // Step 2: while fast and fast.next are not null
  //   slow = slow.next
  //   fast = fast.next.next
  // Step 3: return slow
}`,
      test_cases: "[{\"input\":[[1,2,3,4,5]],\"expected\":3},{\"input\":[[1,2,3,4]],\"expected\":3},{\"input\":[[1]],\"expected\":1}]",
    },
    {
      id: "ll_06",
      title: "Detect a cycle",
      description: "Floyd's algorithm — slow moves one step, fast moves two. They meet if there is a cycle.",
      level: "medium" as QuestionLevel,
      tag: "Linked List",
      hint: "If fast or fast.next becomes null, there is no cycle. If slow === fast, there is a cycle.",
      boilerplate: `function hasCycle(head) {
  // Step 1: set slow = head, fast = head
  // Step 2: while fast and fast.next are not null
  //   slow = slow.next
  //   fast = fast.next.next
  //   if slow === fast return true
  // Step 3: return false
}`,
      test_cases: "[{\"input\":[[3,2,0,-4],1],\"expected\":true},{\"input\":[[1,2],0],\"expected\":true},{\"input\":[[1],-1],\"expected\":false}]",
    },
    {
      id: "ll_07",
      title: "Merge two sorted linked lists",
      description: "Compare heads iteratively and stitch the smaller node in at each step.",
      level: "medium" as QuestionLevel,
      tag: "Linked List",
      hint: "Use a dummy head node to simplify the merge. Attach the remaining list when one runs out.",
      boilerplate: `function mergeLists(l1, l2) {
  // Step 1: create a dummy node, set curr = dummy
  // Step 2: while both l1 and l2 are not null
  //   pick the smaller, attach to curr.next
  //   advance that list and curr
  // Step 3: attach the remaining list
  // Step 4: return dummy.next
}`,
      test_cases: "[{\"input\":[[1,2,4],[1,3,4]],\"expected\":[1,1,2,3,4,4]},{\"input\":[[],[0]],\"expected\":[0]},{\"input\":[[],[]],\"expected\":[]}]",
    },
    {
      id: "ll_08",
      title: "Remove nth node from end",
      description: "Use two pointers with a gap of n. When the front hits null, the back is the target.",
      level: "hard" as QuestionLevel,
      tag: "Linked List",
      hint: "Advance the ahead pointer n steps first. Then move both until ahead is null.",
      boilerplate: `function removeNthFromEnd(head, n) {
  // Step 1: create dummy node pointing to head
  // Step 2: move ahead pointer n+1 steps from dummy
  // Step 3: move both behind and ahead until ahead is null
  // Step 4: behind.next = behind.next.next
  // Step 5: return dummy.next
}`,
      test_cases: "[{\"input\":[[1,2,3,4,5],2],\"expected\":[1,2,3,5]},{\"input\":[[1],1],\"expected\":[]},{\"input\":[[1,2],1],\"expected\":[1]}]",
    },
    {
      id: "sq_01",
      title: "Implement a stack using an array",
      description: "Build push, pop, peek, and isEmpty using a plain array. No built-in stack class allowed.",
      level: "easy" as QuestionLevel,
      tag: "Stack & Queue",
      hint: "Use the end of the array as the top of the stack.",
      boilerplate: `class Stack {
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
}`,
      test_cases: "[{\"ops\":[\"push\",\"push\",\"push\",\"pop\",\"peek\",\"isEmpty\"],\"args\":[[1],[2],[3],[],[],[]],\"expected\":[null,null,null,3,2,false],\"note\":\"push 1,2,3 then pop=3, peek=2, isEmpty=false\"},{\"ops\":[\"push\",\"pop\",\"isEmpty\"],\"args\":[[42],[],[]],\"expected\":[null,42,true],\"note\":\"single push then pop, stack empty\"},{\"ops\":[\"push\",\"push\",\"pop\",\"push\",\"peek\"],\"args\":[[5],[10],[],[7],[]],\"expected\":[null,null,10,null,7],\"note\":\"interleaved push/pop\"},{\"ops\":[\"isEmpty\"],\"args\":[[]],\"expected\":[true],\"note\":\"empty stack from the start\"}]",
    },
    {
      id: "sq_02",
      title: "Implement a queue using an array",
      description: "Build enqueue and dequeue tracking front and rear indices manually.",
      level: "easy" as QuestionLevel,
      tag: "Stack & Queue",
      hint: "Enqueue adds to the rear. Dequeue removes from the front.",
      boilerplate: `class Queue {
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
}`,
      test_cases: "[{\"ops\":[\"enqueue\",\"enqueue\",\"enqueue\",\"dequeue\",\"dequeue\"],\"args\":[[1],[2],[3],[],[]],\"expected\":[null,null,null,1,2],\"note\":\"enqueue 1,2,3 then dequeue twice gives 1,2\"},{\"ops\":[\"enqueue\",\"dequeue\",\"isEmpty\"],\"args\":[[99],[],[]],\"expected\":[null,99,true],\"note\":\"single enqueue dequeue leaves empty\"},{\"ops\":[\"enqueue\",\"enqueue\",\"dequeue\",\"enqueue\",\"dequeue\"],\"args\":[[10],[20],[],[30],[]],\"expected\":[null,null,10,null,20],\"note\":\"interleaved enqueue dequeue\"},{\"ops\":[\"isEmpty\"],\"args\":[[]],\"expected\":[true],\"note\":\"empty queue from the start\"}]",
    },
    {
      id: "sq_03",
      title: "Valid parentheses",
      description: "Push opening brackets onto the stack. On a closing bracket, pop and check if it matches.",
      level: "medium" as QuestionLevel,
      tag: "Stack & Queue",
      hint: "Use a map to pair closing brackets with their opening counterparts.",
      boilerplate: `function isValid(s) {
  // Step 1: create an empty stack
  // Step 2: loop through each character
  //   if opening bracket, push
  //   if closing bracket, pop and check match
  // Step 3: return stack.length === 0
}`,
      test_cases: "[{\"input\":[\"()[]{}\"],\"expected\":true},{\"input\":[\"(]\"],\"expected\":false},{\"input\":[\"{[]}\"],\"expected\":true},{\"input\":[\"([)]\"],\"expected\":false}]",
    },
    {
      id: "sq_04",
      title: "Implement stack using two queues",
      description: "Use one queue for storage and one as a helper to simulate LIFO order on push.",
      level: "medium" as QuestionLevel,
      tag: "Stack & Queue",
      hint: "On push: enqueue to q2, drain all of q1 into q2, then swap q1 and q2.",
      boilerplate: `class StackUsingQueues {
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
}`,
      test_cases: "[{\"ops\":[\"push\",\"push\",\"push\",\"pop\",\"peek\"],\"args\":[[1],[2],[3],[],[]],\"expected\":[null,null,null,3,2],\"note\":\"push 1,2,3 pop=3, peek=2\"},{\"ops\":[\"push\",\"pop\",\"push\",\"pop\"],\"args\":[[5],[],[10],[]],\"expected\":[null,5,null,10],\"note\":\"alternating push pop\"},{\"ops\":[\"push\",\"push\",\"pop\",\"pop\"],\"args\":[[7],[8],[],[]],\"expected\":[null,null,8,7],\"note\":\"LIFO order verified\"},{\"ops\":[\"push\",\"peek\",\"pop\",\"isEmpty\"],\"args\":[[1],[],[],[]],\"expected\":[null,1,1,true],\"note\":\"peek does not remove element\"}]",
    },
    {
      id: "sq_05",
      title: "Next greater element",
      description: "Use a monotonic decreasing stack. Pop elements when you find something larger than the top.",
      level: "hard" as QuestionLevel,
      tag: "Stack & Queue",
      hint: "For each element, while the stack top is smaller than current, pop and record current as the answer.",
      boilerplate: `function nextGreater(arr) {
  // Step 1: create result array filled with -1
  // Step 2: create an empty stack (stores indices)
  // Step 3: for each element:
  //   while stack is not empty and arr[stack.top] < arr[i]
  //     pop and set result[popped] = arr[i]
  //   push i onto stack
  // Step 4: return result
}`,
      test_cases: "[{\"input\":[[4,5,2,10]],\"expected\":[5,10,10,-1]},{\"input\":[[3,2,1]],\"expected\":[-1,-1,-1]},{\"input\":[[1,3,2,4]],\"expected\":[3,4,4,-1]}]",
    },
    {
      id: "sq_06",
      title: "Min stack with O(1) getMin",
      description: "Maintain a parallel min-tracker stack that records the current minimum at every push.",
      level: "hard" as QuestionLevel,
      tag: "Stack & Queue",
      hint: "minStack.push(Math.min(val, minStack.peek())). Pop both stacks together.",
      boilerplate: `class MinStack {
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
}`,
      test_cases: "[{\"ops\":[\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"getMin\"],\"args\":[[-2],[0],[-3],[],[],[]],\"expected\":[null,null,null,-3,null,-2],\"note\":\"classic min stack example\"},{\"ops\":[\"push\",\"push\",\"getMin\",\"pop\",\"getMin\"],\"args\":[[5],[3],[],[],[]],\"expected\":[null,null,3,null,5],\"note\":\"min updates correctly after pop\"},{\"ops\":[\"push\",\"getMin\"],\"args\":[[42],[]],\"expected\":[null,42],\"note\":\"single element min\"},{\"ops\":[\"push\",\"push\",\"push\",\"getMin\"],\"args\":[[1],[2],[3],[]],\"expected\":[null,null,null,1],\"note\":\"min stays at first when ascending\"}]",
    },
    {
      id: "str_01",
      title: "Reverse a string",
      description: "Two-pointer swap from both ends toward the center.",
      level: "easy" as QuestionLevel,
      tag: "Strings",
      hint: "Split into array, swap left and right, join back.",
      boilerplate: `function reverseString(s) {
  // Step 1: convert string to array
  // Step 2: two pointer swap
  // Step 3: join and return
}`,
      test_cases: "[{\"input\":[\"hello\"],\"expected\":\"olleh\"},{\"input\":[\"abcde\"],\"expected\":\"edcba\"},{\"input\":[\"a\"],\"expected\":\"a\"}]",
    },
    {
      id: "str_02",
      title: "Check if palindrome",
      description: "Compare characters from both ends — stop early if any pair mismatches.",
      level: "easy" as QuestionLevel,
      tag: "Strings",
      hint: "left pointer from 0, right from end. Return false if s[left] !== s[right].",
      boilerplate: `function isPalindrome(s) {
  // Step 1: set left = 0, right = s.length - 1
  // Step 2: while left < right
  //   if s[left] !== s[right] return false
  //   left++, right--
  // Step 3: return true
}`,
      test_cases: "[{\"input\":[\"racecar\"],\"expected\":true},{\"input\":[\"hello\"],\"expected\":false},{\"input\":[\"a\"],\"expected\":true},{\"input\":[\"abba\"],\"expected\":true}]",
    },
    {
      id: "str_03",
      title: "Count vowels in a string",
      description: "Traverse each character and check membership in the vowel set.",
      level: "easy" as QuestionLevel,
      tag: "Strings",
      hint: "Create a set of vowels. Loop and increment count whenever the character is in the set.",
      boilerplate: `function countVowels(s) {
  // Step 1: define vowel set: 'aeiouAEIOU'
  // Step 2: loop through each character
  // Step 3: if character is a vowel, increment count
  // Step 4: return count
}`,
      test_cases: "[{\"input\":[\"hello\"],\"expected\":2},{\"input\":[\"aeiou\"],\"expected\":5},{\"input\":[\"bcdfg\"],\"expected\":0},{\"input\":[\"\"],\"expected\":0}]",
    },
    {
      id: "str_04",
      title: "Check if two strings are anagrams",
      description: "Count character frequencies for both strings, then compare the frequency maps.",
      level: "medium" as QuestionLevel,
      tag: "Strings",
      hint: "Build a frequency object from s1. Decrement using s2. Check all values are zero.",
      boilerplate: `function isAnagram(s1, s2) {
  // Step 1: return false if lengths differ
  // Step 2: build frequency map for s1
  // Step 3: decrement frequency for each char in s2
  // Step 4: return true if all frequencies are 0
}`,
      test_cases: "[{\"input\":[\"anagram\",\"nagaram\"],\"expected\":true},{\"input\":[\"rat\",\"car\"],\"expected\":false},{\"input\":[\"a\",\"a\"],\"expected\":true},{\"input\":[\"ab\",\"a\"],\"expected\":false}]",
    },
    {
      id: "str_05",
      title: "Find first non-repeating character",
      description: "Build a frequency map in one pass. Find the first character with frequency one in a second pass.",
      level: "medium" as QuestionLevel,
      tag: "Strings",
      hint: "Two loops — first to count, second to find the first with count 1.",
      boilerplate: `function firstUnique(s) {
  // Step 1: build frequency map
  // Step 2: loop through string again
  //   return index of first char with freq === 1
  // Step 3: return -1 if none found
}`,
      test_cases: "[{\"input\":[\"leetcode\"],\"expected\":0},{\"input\":[\"loveleetcode\"],\"expected\":2},{\"input\":[\"aabb\"],\"expected\":-1}]",
    },
    {
      id: "str_06",
      title: "Longest substring without repeating characters",
      description: "Sliding window — use a set to track current window contents. Expand right, shrink left on duplicates.",
      level: "hard" as QuestionLevel,
      tag: "Strings",
      hint: "When s[right] is already in the set, remove s[left] and advance left until it is gone.",
      boilerplate: `function lengthOfLongestSubstring(s) {
  // Step 1: set left = 0, best = 0, seen = new Set()
  // Step 2: loop right from 0 to s.length - 1
  //   while s[right] is in seen, delete s[left] and left++
  //   add s[right] to seen
  //   best = Math.max(best, right - left + 1)
  // Step 3: return best
}`,
      test_cases: "[{\"input\":[\"abcabcbb\"],\"expected\":3},{\"input\":[\"bbbbb\"],\"expected\":1},{\"input\":[\"pwwkew\"],\"expected\":3},{\"input\":[\"\"],\"expected\":0}]",
    },
    {
      id: "bs_01",
      title: "Classic binary search",
      description: "Find a target in a sorted array by halving the search space each step.",
      level: "easy" as QuestionLevel,
      tag: "Binary Search",
      hint: "mid = Math.floor((low + high) / 2). Adjust low or high based on comparison.",
      boilerplate: `function binarySearch(arr, target) {
  // Step 1: set low = 0, high = arr.length - 1
  // Step 2: while low <= high
  //   mid = Math.floor((low + high) / 2)
  //   if arr[mid] === target return mid
  //   if arr[mid] < target, low = mid + 1
  //   else high = mid - 1
  // Step 3: return -1
}`,
      test_cases: "[{\"input\":[[-1,0,3,5,9,12],9],\"expected\":4},{\"input\":[[-1,0,3,5,9,12],2],\"expected\":-1},{\"input\":[[5],5],\"expected\":0}]",
    },
    {
      id: "bs_02",
      title: "Find insert position",
      description: "Return the index where the target should be inserted to keep the array sorted.",
      level: "easy" as QuestionLevel,
      tag: "Binary Search",
      hint: "When the loop ends, low is the correct insert position.",
      boilerplate: `function searchInsert(arr, target) {
  // Step 1: standard binary search setup
  // Step 2: run binary search
  // Step 3: return low (the insert position) when loop ends
}`,
      test_cases: "[{\"input\":[[1,3,5,6],5],\"expected\":2},{\"input\":[[1,3,5,6],2],\"expected\":1},{\"input\":[[1,3,5,6],7],\"expected\":4},{\"input\":[[1,3,5,6],0],\"expected\":0}]",
    },
    {
      id: "bs_03",
      title: "First and last position of target",
      description: "Run binary search twice — once biased left to find first, once biased right to find last.",
      level: "medium" as QuestionLevel,
      tag: "Binary Search",
      hint: "For first: when arr[mid] === target, save mid but continue searching left (high = mid - 1).",
      boilerplate: `function firstAndLast(arr, target) {
  // Step 1: write findFirst(arr, target) — binary search that saves result and goes left on match
  // Step 2: write findLast(arr, target) — binary search that saves result and goes right on match
  // Step 3: return [findFirst, findLast]
}`,
      test_cases: "[{\"input\":[[5,7,7,8,8,10],8],\"expected\":[3,4]},{\"input\":[[5,7,7,8,8,10],6],\"expected\":[-1,-1]},{\"input\":[[],0],\"expected\":[-1,-1]}]",
    },
    {
      id: "bs_04",
      title: "Search in rotated sorted array",
      description: "At each mid, determine which half is sorted, then decide which side the target is on.",
      level: "medium" as QuestionLevel,
      tag: "Binary Search",
      hint: "If arr[low] <= arr[mid], the left half is sorted. Check if target falls within it.",
      boilerplate: `function searchRotated(arr, target) {
  // Step 1: set low = 0, high = arr.length - 1
  // Step 2: while low <= high compute mid
  //   if arr[mid] === target return mid
  //   determine which half is sorted
  //   check if target is in that sorted half
  //   adjust low or high accordingly
  // Step 3: return -1
}`,
      test_cases: "[{\"input\":[[4,5,6,7,0,1,2],0],\"expected\":4},{\"input\":[[4,5,6,7,0,1,2],3],\"expected\":-1},{\"input\":[[1],0],\"expected\":-1}]",
    },
    {
      id: "bs_05",
      title: "Find minimum in rotated array",
      description: "The minimum is always in the unsorted half. Use that property to narrow down.",
      level: "hard" as QuestionLevel,
      tag: "Binary Search",
      hint: "If arr[mid] > arr[high], the minimum is in the right half. Otherwise it is in the left.",
      boilerplate: `function findMin(arr) {
  // Step 1: set low = 0, high = arr.length - 1
  // Step 2: while low < high
  //   mid = Math.floor((low + high) / 2)
  //   if arr[mid] > arr[high], low = mid + 1
  //   else high = mid
  // Step 3: return arr[low]
}`,
      test_cases: "[{\"input\":[[3,4,5,1,2]],\"expected\":1},{\"input\":[[4,5,6,7,0,1,2]],\"expected\":0},{\"input\":[[11,13,15,17]],\"expected\":11}]",
    },
    {
      id: "rec_01",
      title: "Factorial",
      description: "Base case is n === 0 returns 1. Recursive case multiplies n by factorial(n-1).",
      level: "easy" as QuestionLevel,
      tag: "Recursion",
      hint: "if (n === 0) return 1; return n * factorial(n - 1);",
      boilerplate: `function factorial(n) {
  // Base case: what is the smallest input?
  // Recursive case: how does n relate to n-1?
}`,
      test_cases: "[{\"input\":[5],\"expected\":120},{\"input\":[0],\"expected\":1},{\"input\":[1],\"expected\":1},{\"input\":[6],\"expected\":720}]",
    },
    {
      id: "rec_02",
      title: "Fibonacci number",
      description: "Base cases are fib(0) = 0 and fib(1) = 1. Return fib(n-1) + fib(n-2).",
      level: "easy" as QuestionLevel,
      tag: "Recursion",
      hint: "Watch how the call stack grows — this is the key insight of this problem.",
      boilerplate: `function fib(n) {
  // Base cases: n === 0 and n === 1
  // Recursive case: sum of previous two
}`,
      test_cases: "[{\"input\":[0],\"expected\":0},{\"input\":[1],\"expected\":1},{\"input\":[6],\"expected\":8},{\"input\":[10],\"expected\":55}]",
    },
    {
      id: "rec_03",
      title: "Power function",
      description: "If exponent is even, square the base and halve the exponent. Handles odd with one extra multiply.",
      level: "medium" as QuestionLevel,
      tag: "Recursion",
      hint: "pow(x, n) = pow(x*x, n/2) when n is even. pow(x, n) = x * pow(x, n-1) when odd.",
      boilerplate: `function power(x, n) {
  // Base case: n === 0 returns 1
  // If n is even: return power(x * x, n / 2)
  // If n is odd: return x * power(x, n - 1)
}`,
      test_cases: "[{\"input\":[2,10],\"expected\":1024},{\"input\":[2,0],\"expected\":1},{\"input\":[3,3],\"expected\":27},{\"input\":[5,2],\"expected\":25}]",
    },
    {
      id: "rec_04",
      title: "Flatten a nested array",
      description: "Recurse into each element — if it is an array, flatten it. Otherwise push it to result.",
      level: "medium" as QuestionLevel,
      tag: "Recursion",
      hint: "Check Array.isArray(item). If yes, recurse. If no, push to result.",
      boilerplate: `function flatten(arr) {
  const result = [];
  // For each item in arr:
  //   if item is an array, spread flatten(item) into result
  //   else push item into result
  return result;
}`,
      test_cases: "[{\"input\":[[1,[2,[3,[4]]]]],\"expected\":[1,2,3,4]},{\"input\":[[1,2,3]],\"expected\":[1,2,3]},{\"input\":[[1,[2,3],[4,[5]]]],\"expected\":[1,2,3,4,5]}]",
    },
    {
      id: "rec_05",
      title: "Tower of Hanoi",
      description: "Move n-1 disks to helper, move the large disk to target, move n-1 disks from helper to target.",
      level: "hard" as QuestionLevel,
      tag: "Recursion",
      hint: "hanoi(n-1, from, via, to) then move disk, then hanoi(n-1, via, to, from).",
      boilerplate: `function hanoi(n, from, to, via) {
  // Base case: n === 0, do nothing
  // Step 1: move n-1 disks from 'from' to 'via' using 'to'
  // Step 2: move the nth disk from 'from' to 'to'
  // Step 3: move n-1 disks from 'via' to 'to' using 'from'
  console.log(\`Move disk \${n} from \${from} to \${to}\`);
}`,
      test_cases: "[{\"input\":[1,\"A\",\"C\",\"B\"],\"expected\":1,\"note\":\"1 disk = 1 move\"},{\"input\":[2,\"A\",\"C\",\"B\"],\"expected\":3,\"note\":\"2 disks = 3 moves\"},{\"input\":[3,\"A\",\"C\",\"B\"],\"expected\":7,\"note\":\"3 disks = 7 moves\"},{\"input\":[4,\"A\",\"C\",\"B\"],\"expected\":15,\"note\":\"4 disks = 15 moves\"}]",
    },
    {
      id: "rec_06",
      title: "Generate all subsets",
      description: "At each step, choose to include or exclude the current element. Two recursive branches each call.",
      level: "hard" as QuestionLevel,
      tag: "Recursion",
      hint: "subsets(index + 1, [...current, arr[index]]) and subsets(index + 1, current).",
      boilerplate: `function subsets(arr) {
  const result = [];
  function generate(index, current) {
    // Base case: index === arr.length, push current copy to result
    // Include arr[index]: recurse with it added
    // Exclude arr[index]: recurse without it
  }
  generate(0, []);
  return result;
}`,
      test_cases: "[{\"input\":[[1,2,3]],\"expected\":[[],[3],[2],[2,3],[1],[1,3],[1,2],[1,2,3]]},{\"input\":[[1]],\"expected\":[[],[1]]}]",
    },
    {
      id: "bt_01",
      title: "Generate all permutations",
      description: "Swap each element into the current position and recurse. Backtrack by swapping back.",
      level: "medium" as QuestionLevel,
      tag: "Backtracking",
      hint: "Swap arr[start] with arr[i], recurse with start + 1, then swap back.",
      boilerplate: `function permutations(arr) {
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
}`,
      test_cases: "[{\"input\":[[1,2,3]],\"expected\":[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,2,1],[3,1,2]]},{\"input\":[[1]],\"expected\":[[1]]}]",
    },
    {
      id: "bt_02",
      title: "Generate all combinations of size k",
      description: "Pick elements one by one from start index onwards. Stop when combination size equals k.",
      level: "medium" as QuestionLevel,
      tag: "Backtracking",
      hint: "Prune early: if remaining elements are not enough to fill k slots, stop.",
      boilerplate: `function combinations(arr, k) {
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
}`,
      test_cases: "[{\"input\":[[1,2,3,4],2],\"expected\":[[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]},{\"input\":[[1,2],1],\"expected\":[[1],[2]]}]",
    },
    {
      id: "bt_03",
      title: "Solve a maze",
      description: "Try all four directions from current cell. Mark visited, recurse, unmark on backtrack.",
      level: "medium" as QuestionLevel,
      tag: "Backtracking",
      hint: "Directions: up, down, left, right. Check bounds and visited before each move.",
      boilerplate: `function solveMaze(maze) {
  const path = [];
  const visited = Array.from({length: maze.length}, () => new Array(maze[0].length).fill(false));
  function dfs(row, col) {
    // Base case: reached exit (bottom-right cell), return true
    // Check bounds, wall, visited — return false if invalid
    // Mark visited, push to path
    // Try all 4 directions
    // If no direction worked, pop from path, unmark visited, return false
  }
  dfs(0, 0);
  return path;
}`,
      test_cases: "[{\"input\":[[[0,0,1],[0,0,0],[1,0,0]]],\"expected\":[[0,0],[1,0],[1,1],[1,2],[2,2]],\"note\":\"standard 3x3 maze\"},{\"input\":[[[0,0],[0,0]]],\"expected\":[[0,0],[1,0],[1,1]],\"note\":\"2x2 open maze\"},{\"input\":[[[0,1],[0,0]]],\"expected\":[[0,0],[1,0],[1,1]],\"note\":\"blocked top-right path\"},{\"input\":[[[0]]],\"expected\":[[0,0]],\"note\":\"1x1 maze, start is exit\"}]",
    },
    {
      id: "bt_04",
      title: "N-Queens problem",
      description: "Place one queen per row. Check column and diagonal conflicts before placing. Backtrack on conflict.",
      level: "hard" as QuestionLevel,
      tag: "Backtracking",
      hint: "Track occupied columns and diagonals using sets. Use row - col and row + col as diagonal keys.",
      boilerplate: `function nQueens(n) {
  const results = [];
  const cols = new Set(), diag1 = new Set(), diag2 = new Set();
  const board = Array.from({length: n}, () => new Array(n).fill('.'));
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
}`,
      test_cases: "[{\"input\":[4],\"expected\":2},{\"input\":[1],\"expected\":1}]",
    },
    {
      id: "gr_01",
      title: "Coin change — greedy with canonical coins",
      description: "Always pick the largest denomination coin that fits. Works for standard coin systems.",
      level: "easy" as QuestionLevel,
      tag: "Greedy",
      hint: "Sort coins descending. For each coin, use as many as possible before moving to the next.",
      boilerplate: `function coinChangeGreedy(coins, amount) {
  // Step 1: sort coins descending
  // Step 2: for each coin, use Math.floor(amount / coin) times
  //   subtract from amount, add to count
  // Step 3: return count (or -1 if amount is not zero)
}`,
      test_cases: "[{\"input\":[[25,10,5,1],36],\"expected\":3},{\"input\":[[25,10,5,1],11],\"expected\":2},{\"input\":[[1],5],\"expected\":5}]",
    },
    {
      id: "gr_02",
      title: "Activity selection problem",
      description: "Sort activities by finish time. Always pick the next activity that starts after the last one ends.",
      level: "medium" as QuestionLevel,
      tag: "Greedy",
      hint: "Sort by endTime. Track lastEnd. Include activity if startTime >= lastEnd.",
      boilerplate: `function activitySelection(activities) {
  // Step 1: sort activities by end time
  // Step 2: set count = 1, lastEnd = activities[0].end
  // Step 3: for each remaining activity
  //   if activity.start >= lastEnd, select it, update lastEnd, count++
  // Step 4: return count
}`,
      test_cases: "[{\"input\":[[[1,3],[2,5],[3,9],[6,8]]],\"expected\":3},{\"input\":[[[1,2],[2,3],[3,4]]],\"expected\":3}]",
    },
    {
      id: "gr_03",
      title: "Jump game — can you reach the end?",
      description: "Track the farthest index reachable. If the current index ever exceeds it, you are stuck.",
      level: "medium" as QuestionLevel,
      tag: "Greedy",
      hint: "maxReach = Math.max(maxReach, i + nums[i]). If i > maxReach, return false.",
      boilerplate: `function canJump(nums) {
  // Step 1: set maxReach = 0
  // Step 2: for each index i
  //   if i > maxReach return false
  //   maxReach = Math.max(maxReach, i + nums[i])
  // Step 3: return true
}`,
      test_cases: "[{\"input\":[[2,3,1,1,4]],\"expected\":true},{\"input\":[[3,2,1,0,4]],\"expected\":false},{\"input\":[[0]],\"expected\":true}]",
    },
    {
      id: "gr_04",
      title: "Minimum platforms needed",
      description: "Sort arrivals and departures separately. Count overlapping trains at any point.",
      level: "easy" as QuestionLevel,
      tag: "Greedy",
      hint: "Two pointer approach — if arrival[i] <= departure[j], a new platform is needed.",
      boilerplate: `function minPlatforms(arrivals, departures) {
  // Step 1: sort both arrays
  // Step 2: set platforms = 1, maxPlatforms = 1, i = 1, j = 0
  // Step 3: while i < n and j < n
  //   if arrivals[i] <= departures[j], platforms++, i++
  //   else platforms--, j++
  //   update maxPlatforms
  // Step 4: return maxPlatforms
}`,
      test_cases: "[{\"input\":[[900,940,950,1100,1500,1800],[910,1200,1120,1130,1900,2000]],\"expected\":3,\"note\":\"classic example\"},{\"input\":[[900,1000],[910,1200]],\"expected\":2,\"note\":\"both overlap\"},{\"input\":[[900,1000],[1001,1200]],\"expected\":1,\"note\":\"no overlap, sequential\"},{\"input\":[[900],[1000]],\"expected\":1,\"note\":\"single train\"}]",
    },
    {
      id: "hp_01",
      title: "Find kth largest element",
      description: "Build a min-heap of size k. For each new element, if larger than heap top, replace it.",
      level: "easy" as QuestionLevel,
      tag: "Heaps",
      hint: "Simulate a min-heap using a sorted array for simplicity. The kth largest is the smallest in the heap.",
      boilerplate: `function kthLargest(arr, k) {
  // Simulate min-heap with a sorted array of size k
  // Step 1: fill heap with first k elements and sort
  // Step 2: for remaining elements
  //   if element > heap[0], replace heap[0] and re-sort
  // Step 3: return heap[0]
}`,
      test_cases: "[{\"input\":[[3,2,1,5,6,4],2],\"expected\":5},{\"input\":[[3,2,3,1,2,4,5,5,6],4],\"expected\":4}]",
    },
    {
      id: "hp_02",
      title: "Merge k sorted arrays",
      description: "Push the first element of each array into a min-heap. Pop the minimum and push the next from that array.",
      level: "medium" as QuestionLevel,
      tag: "Heaps",
      hint: "Each heap entry stores {value, arrayIndex, elementIndex} so you know where to pull the next element.",
      boilerplate: `function mergeKSorted(arrays) {
  const result = [];
  // Simulate min-heap: store [value, arrIdx, elemIdx]
  // Step 1: push first element of each array
  // Step 2: while heap is not empty
  //   pop minimum
  //   push to result
  //   if next element exists in same array, push it
  return result;
}`,
      test_cases: "[{\"input\":[[[1,4,7],[2,5,8],[3,6,9]]],\"expected\":[1,2,3,4,5,6,7,8,9]},{\"input\":[[[1],[2],[3]]],\"expected\":[1,2,3]}]",
    },
    {
      id: "hp_03",
      title: "Top k frequent elements",
      description: "Count frequencies with a map. Use a min-heap of size k to track the top entries.",
      level: "medium" as QuestionLevel,
      tag: "Heaps",
      hint: "Build a frequency map first. Then simulate a min-heap over frequencies.",
      boilerplate: `function topKFrequent(arr, k) {
  // Step 1: build frequency map
  // Step 2: convert map to array of [element, count] pairs
  // Step 3: sort by count descending
  // Step 4: return first k elements
}`,
      test_cases: "[{\"input\":[[1,1,1,2,2,3],2],\"expected\":[1,2]},{\"input\":[[1],1],\"expected\":[1]}]",
    },
    {
      id: "hp_04",
      title: "Median from a data stream",
      description: "Maintain a max-heap for the lower half and a min-heap for the upper half. Balance after each insert.",
      level: "hard" as QuestionLevel,
      tag: "Heaps",
      hint: "lo is a max-heap (negate values to simulate). hi is a min-heap. Keep sizes equal or lo one larger.",
      boilerplate: `class MedianFinder {
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
}`,
      test_cases: "[{\"ops\":[\"addNum\",\"addNum\",\"findMedian\",\"addNum\",\"findMedian\"],\"args\":[[1],[2],[],[3],[]],\"expected\":[null,null,1.5,null,2],\"note\":\"basic median stream\"},{\"ops\":[\"addNum\",\"findMedian\"],\"args\":[[1],[]],\"expected\":[null,1],\"note\":\"single element median\"},{\"ops\":[\"addNum\",\"addNum\",\"findMedian\"],\"args\":[[2],[3],[]],\"expected\":[null,null,2.5],\"note\":\"two elements median\"},{\"ops\":[\"addNum\",\"addNum\",\"addNum\",\"addNum\",\"findMedian\"],\"args\":[[5],[3],[8],[4],[]],\"expected\":[null,null,null,null,4.5],\"note\":\"four elements median\"}]",
    },
    {
      id: "hp_05",
      title: "Reorganize string",
      description: "Use a max-heap by frequency. Always place the most frequent unused character next.",
      level: "hard" as QuestionLevel,
      tag: "Heaps",
      hint: "After placing a character, hold it out for one step before re-inserting so it is not placed twice in a row.",
      boilerplate: `function reorganizeString(s) {
  // Step 1: build frequency map
  // Step 2: simulate max-heap (sort by frequency)
  // Step 3: while heap is not empty
  //   pop most frequent, append to result
  //   re-insert previous character if its count > 0
  // Step 4: return result or '' if impossible
}`,
      test_cases: "[{\"input\":[\"aab\"],\"expected\":\"aba\"},{\"input\":[\"aaab\"],\"expected\":\"\"},{\"input\":[\"aabb\"],\"expected\":\"abab\"}]",
    },
    {
      id: "btr_01",
      title: "Inorder traversal",
      description: "Recurse left, visit node, recurse right. Classic left-root-right order.",
      level: "easy" as QuestionLevel,
      tag: "Binary Tree",
      hint: "inorder(node.left), push node.val, inorder(node.right).",
      boilerplate: `function inorder(root) {
  const result = [];
  function traverse(node) {
    // Base case: node is null, return
    // Recurse left
    // Push node.val
    // Recurse right
  }
  traverse(root);
  return result;
}`,
      test_cases: "[{\"input\":[[1,null,2,3]],\"expected\":[1,3,2]},{\"input\":[null],\"expected\":[]},{\"input\":[[1]],\"expected\":[1]}]",
    },
    {
      id: "btr_02",
      title: "Find height of tree",
      description: "Height is 1 plus the maximum of left and right subtree heights. Base case: null returns 0.",
      level: "easy" as QuestionLevel,
      tag: "Binary Tree",
      hint: "return 1 + Math.max(height(node.left), height(node.right)).",
      boilerplate: `function height(root) {
  // Base case: root is null, return 0
  // Recursive case: 1 + max of left and right heights
}`,
      test_cases: "[{\"input\":[[3,9,20,null,null,15,7]],\"expected\":3},{\"input\":[[1,null,2]],\"expected\":2},{\"input\":[null],\"expected\":0}]",
    },
    {
      id: "btr_03",
      title: "Level order traversal",
      description: "Use a queue. Process all nodes at the current level before pushing their children.",
      level: "medium" as QuestionLevel,
      tag: "Binary Tree",
      hint: "Push root. For each node dequeued, push its left and right children if they exist.",
      boilerplate: `function levelOrder(root) {
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
}`,
      test_cases: "[{\"input\":[[3,9,20,null,null,15,7]],\"expected\":[[3],[9,20],[15,7]]},{\"input\":[[1]],\"expected\":[[1]]},{\"input\":[null],\"expected\":[]}]",
    },
    {
      id: "btr_04",
      title: "Check if tree is symmetric",
      description: "Compare left and right subtrees mirror-recursively — outer nodes and inner nodes must match.",
      level: "medium" as QuestionLevel,
      tag: "Binary Tree",
      hint: "isMirror(left, right): compare left.val === right.val, then isMirror(left.left, right.right) and isMirror(left.right, right.left).",
      boilerplate: `function isSymmetric(root) {
  function isMirror(left, right) {
    // Base cases: both null = true, one null = false
    // Check values match and recurse on mirror children
  }
  return isMirror(root.left, root.right);
}`,
      test_cases: "[{\"input\":[[1,2,2,3,4,4,3]],\"expected\":true},{\"input\":[[1,2,2,null,3,null,3]],\"expected\":false}]",
    },
    {
      id: "btr_05",
      title: "Lowest common ancestor",
      description: "If the current node is p or q, return it. The LCA is where left and right both return non-null.",
      level: "medium" as QuestionLevel,
      tag: "Binary Tree",
      hint: "If both sides return non-null, the current node is the LCA.",
      boilerplate: `function lowestCommonAncestor(root, p, q) {
  // Base case: root is null, or root === p, or root === q — return root
  // Recurse on left and right
  // If both return non-null, current node is LCA
  // Otherwise return whichever is non-null
}`,
      test_cases: "[{\"input\":[[3,5,1,6,2,0,8,null,null,7,4],5,1],\"expected\":3},{\"input\":[[3,5,1,6,2,0,8,null,null,7,4],5,4],\"expected\":5}]",
    },
    {
      id: "btr_06",
      title: "Maximum path sum",
      description: "At each node compute the best single-arm gain downward. Update global max with both arms combined.",
      level: "hard" as QuestionLevel,
      tag: "Binary Tree",
      hint: "gain(node) = node.val + max(0, gain(left)) + max(0, gain(right)). But return only one arm.",
      boilerplate: `function maxPathSum(root) {
  let maxSum = -Infinity;
  function gain(node) {
    // Base case: null returns 0
    // Compute left gain and right gain (floor at 0)
    // Update maxSum with node.val + leftGain + rightGain
    // Return node.val + max(leftGain, rightGain) for parent
  }
  gain(root);
  return maxSum;
}`,
      test_cases: "[{\"input\":[[1,2,3]],\"expected\":6},{\"input\":[[-10,9,20,null,null,15,7]],\"expected\":42}]",
    },
    {
      id: "btr_07",
      title: "Serialize and deserialize a tree",
      description: "Encode with preorder traversal using a null marker. Rebuild by consuming the encoded list.",
      level: "hard" as QuestionLevel,
      tag: "Binary Tree",
      hint: "serialize: preorder, write 'null' for empty nodes. deserialize: consume list with a pointer.",
      boilerplate: `function serialize(root) {
  // Preorder traversal, join with commas, use 'null' for empty nodes
}

function deserialize(data) {
  const nodes = data.split(',');
  let index = 0;
  function build() {
    // If nodes[index] === 'null', index++ and return null
    // Otherwise create node with parseInt value, index++
    // Recurse for left and right
  }
  return build();
}`,
      test_cases: "[{\"input\":[[1,2,3,null,null,4,5]],\"expected\":[1,2,3,null,null,4,5],\"note\":\"standard tree\"},{\"input\":[null],\"expected\":null,\"note\":\"empty tree\"},{\"input\":[[1]],\"expected\":[1],\"note\":\"single node\"},{\"input\":[[1,2,null,3]],\"expected\":[1,2,null,3],\"note\":\"left-skewed partial tree\"}]",
    },
    {
      id: "bst_01",
      title: "Search in a BST",
      description: "Go left if target is smaller, right if larger. Return the node when values match.",
      level: "easy" as QuestionLevel,
      tag: "BST",
      hint: "if (val < node.val) recurse left. if (val > node.val) recurse right.",
      boilerplate: `function searchBST(root, val) {
  // Base case: root is null or root.val === val, return root
  // If val < root.val, search left
  // If val > root.val, search right
}`,
      test_cases: "[{\"input\":[[4,2,7,1,3],2],\"expected\":[2,1,3]},{\"input\":[[4,2,7,1,3],5],\"expected\":null}]",
    },
    {
      id: "bst_02",
      title: "Insert into a BST",
      description: "Find the correct null leaf position following BST ordering and insert the new node there.",
      level: "easy" as QuestionLevel,
      tag: "BST",
      hint: "Recurse to the correct position. When you hit null, return a new node.",
      boilerplate: `function insertBST(root, val) {
  // Base case: root is null, return new node with val
  // If val < root.val, root.left = insertBST(root.left, val)
  // If val > root.val, root.right = insertBST(root.right, val)
  // Return root
}`,
      test_cases: "[{\"input\":[[4,2,7,1,3],5],\"expected\":[4,2,7,1,3,5]},{\"input\":[null,5],\"expected\":[5]}]",
    },
    {
      id: "bst_03",
      title: "Validate a BST",
      description: "Pass down a valid range per node. Left must be less than node, right must be greater.",
      level: "medium" as QuestionLevel,
      tag: "BST",
      hint: "validate(node, min, max). Left subtree: max = node.val. Right subtree: min = node.val.",
      boilerplate: `function isValidBST(root) {
  function validate(node, min, max) {
    // Base case: null returns true
    // If node.val <= min or node.val >= max return false
    // Recurse left with max = node.val
    // Recurse right with min = node.val
  }
  return validate(root, -Infinity, Infinity);
}`,
      test_cases: "[{\"input\":[[2,1,3]],\"expected\":true},{\"input\":[[5,1,4,null,null,3,6]],\"expected\":false}]",
    },
    {
      id: "bst_04",
      title: "Kth smallest element in BST",
      description: "Inorder traversal gives sorted order. Stop and return at the kth visited node.",
      level: "medium" as QuestionLevel,
      tag: "BST",
      hint: "Keep a counter. Increment on each visit. Return node.val when counter equals k.",
      boilerplate: `function kthSmallestBST(root, k) {
  let count = 0, result = null;
  function inorder(node) {
    // Base case: null or result found, return
    // Recurse left
    // Increment count, if count === k set result
    // Recurse right
  }
  inorder(root);
  return result;
}`,
      test_cases: "[{\"input\":[[3,1,4,null,2],1],\"expected\":1},{\"input\":[[5,3,6,2,4,null,null,1],3],\"expected\":3}]",
    },
    {
      id: "bst_05",
      title: "Delete a node from BST",
      description: "Three cases — leaf, one child, two children. For two children replace with inorder successor.",
      level: "medium" as QuestionLevel,
      tag: "BST",
      hint: "Inorder successor = leftmost node in the right subtree.",
      boilerplate: `function deleteNode(root, key) {
  // If key < root.val recurse left
  // If key > root.val recurse right
  // If key === root.val:
  //   if no left child return root.right
  //   if no right child return root.left
  //   otherwise find inorder successor (min of right subtree)
  //   replace root.val with successor.val
  //   delete successor from right subtree
  return root;
}`,
      test_cases: "[{\"input\":[[5,3,6,2,4,null,7],3],\"expected\":[5,4,6,2,null,null,7]},{\"input\":[[5,3,6,2,4,null,7],0],\"expected\":[5,3,6,2,4,null,7]}]",
    },
    {
      id: "bst_06",
      title: "Balance a BST",
      description: "Inorder traversal to get sorted array, then recursively build from the middle element.",
      level: "hard" as QuestionLevel,
      tag: "BST",
      hint: "sortedArrayToBST: pick mid as root, recurse on left half for left child, right half for right child.",
      boilerplate: `function balanceBST(root) {
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
}`,
      test_cases: "[{\"input\":[[1,null,2,null,3,null,4]],\"expected\":[2,1,3,null,null,null,4],\"note\":\"right-skewed to balanced\"},{\"input\":[[1]],\"expected\":[1],\"note\":\"single node stays same\"},{\"input\":[[1,null,2]],\"expected\":[1,null,2],\"note\":\"two nodes\"},{\"input\":[[3,2,null,1]],\"expected\":[2,1,3],\"note\":\"left-skewed to balanced\"}]",
    },
    {
      id: "dp_01",
      title: "Fibonacci with memoization",
      description: "Store computed values in a table. Before computing fib(n) check if it is already stored.",
      level: "easy" as QuestionLevel,
      tag: "Dynamic Programming",
      hint: "memo = {}. if (memo[n]) return memo[n]. memo[n] = fib(n-1) + fib(n-2).",
      boilerplate: `function fibMemo(n, memo = {}) {
  // Check if already computed
  // Base cases: n <= 1
  // Compute, store in memo, return
}`,
      test_cases: "[{\"input\":[10],\"expected\":55},{\"input\":[0],\"expected\":0},{\"input\":[1],\"expected\":1},{\"input\":[6],\"expected\":8}]",
    },
    {
      id: "dp_02",
      title: "Climbing stairs",
      description: "To reach stair n you came from n-1 or n-2. Same recurrence as Fibonacci.",
      level: "easy" as QuestionLevel,
      tag: "Dynamic Programming",
      hint: "dp[i] = dp[i-1] + dp[i-2]. Base cases: dp[1] = 1, dp[2] = 2.",
      boilerplate: `function climbStairs(n) {
  // Step 1: create dp array of size n+1
  // Step 2: dp[1] = 1, dp[2] = 2
  // Step 3: for i from 3 to n: dp[i] = dp[i-1] + dp[i-2]
  // Step 4: return dp[n]
}`,
      test_cases: "[{\"input\":[2],\"expected\":2},{\"input\":[3],\"expected\":3},{\"input\":[5],\"expected\":8},{\"input\":[10],\"expected\":89}]",
    },
    {
      id: "dp_03",
      title: "0/1 Knapsack",
      description: "dp[i][w] = best value using first i items with capacity w. Pick max of include vs exclude.",
      level: "medium" as QuestionLevel,
      tag: "Dynamic Programming",
      hint: "Include: dp[i-1][w - weight[i]] + value[i]. Exclude: dp[i-1][w]. Take the max.",
      boilerplate: `function knapsack(weights, values, capacity) {
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
}`,
      test_cases: "[{\"input\":[[1,3,4,5],[1,4,5,7],7],\"expected\":9},{\"input\":[[2,3,4,5],[3,4,5,6],5],\"expected\":7}]",
    },
    {
      id: "dp_04",
      title: "Longest common subsequence",
      description: "If characters match, extend the diagonal. Otherwise take the max of left or top cell.",
      level: "medium" as QuestionLevel,
      tag: "Dynamic Programming",
      hint: "dp[i][j] = dp[i-1][j-1] + 1 if match. Else max(dp[i-1][j], dp[i][j-1]).",
      boilerplate: `function lcs(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({length: m+1}, () => new Array(n+1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // If characters match, dp[i][j] = dp[i-1][j-1] + 1
      // Else dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    }
  }
  return dp[m][n];
}`,
      test_cases: "[{\"input\":[\"abcde\",\"ace\"],\"expected\":3},{\"input\":[\"abc\",\"abc\"],\"expected\":3},{\"input\":[\"abc\",\"def\"],\"expected\":0}]",
    },
    {
      id: "dp_05",
      title: "Coin change — minimum coins",
      description: "For each amount, build up from smaller amounts. dp[amount] = minimum coins needed.",
      level: "medium" as QuestionLevel,
      tag: "Dynamic Programming",
      hint: "dp[i] = min(dp[i], dp[i - coin] + 1) for each coin that fits.",
      boilerplate: `function coinChange(coins, amount) {
  const dp = new Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let i = 1; i <= amount; i++) {
    for (const coin of coins) {
      // If coin <= i and dp[i - coin] + 1 < dp[i]
      //   update dp[i]
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
      test_cases: "[{\"input\":[[1,5,6,9],11],\"expected\":2},{\"input\":[[2],3],\"expected\":-1},{\"input\":[[1,2,5],11],\"expected\":3}]",
    },
    {
      id: "dp_06",
      title: "Edit distance",
      description: "Cost of transforming one string into another via insert, delete, replace. Fill a 2D DP grid.",
      level: "hard" as QuestionLevel,
      tag: "Dynamic Programming",
      hint: "If chars match: dp[i][j] = dp[i-1][j-1]. Else: 1 + min(insert, delete, replace).",
      boilerplate: `function editDistance(s1, s2) {
  const m = s1.length, n = s2.length;
  const dp = Array.from({length: m+1}, (_, i) => new Array(n+1).fill(0).map((_, j) => i || j));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      // If s1[i-1] === s2[j-1], dp[i][j] = dp[i-1][j-1]
      // Else 1 + min of: dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)
    }
  }
  return dp[m][n];
}`,
      test_cases: "[{\"input\":[\"horse\",\"ros\"],\"expected\":3},{\"input\":[\"intention\",\"execution\"],\"expected\":5},{\"input\":[\"\",\"abc\"],\"expected\":3}]",
    },
    {
      id: "dp_07",
      title: "Longest increasing subsequence",
      description: "dp[i] = length of LIS ending at index i. For each j < i check if arr[j] < arr[i].",
      level: "hard" as QuestionLevel,
      tag: "Dynamic Programming",
      hint: "dp[i] = 1 + max(dp[j]) for all j < i where arr[j] < arr[i]. Answer is max of dp.",
      boilerplate: `function lis(arr) {
  const dp = new Array(arr.length).fill(1);
  for (let i = 1; i < arr.length; i++) {
    for (let j = 0; j < i; j++) {
      // If arr[j] < arr[i], dp[i] = Math.max(dp[i], dp[j] + 1)
    }
  }
  return Math.max(...dp);
}`,
      test_cases: "[{\"input\":[[10,9,2,5,3,7,101,18]],\"expected\":4},{\"input\":[[0,1,0,3,2,3]],\"expected\":4},{\"input\":[[7,7,7,7]],\"expected\":1}]",
    },
    {
      id: "tr_01",
      title: "Insert a word into a trie",
      description: "For each character, create a child node if it does not exist. Mark the last node as end of word.",
      level: "easy" as QuestionLevel,
      tag: "Trie",
      hint: "node.children[ch] = node.children[ch] || {}. After loop, node.isEnd = true.",
      boilerplate: `class TrieNode {
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
}`,
      test_cases: "[{\"ops\":[\"insert\",\"search\",\"search\"],\"args\":[[\"apple\"],[\"apple\"],[\"app\"]],\"expected\":[null,true,false],\"note\":\"insert apple, search full word and prefix\"},{\"ops\":[\"insert\",\"insert\",\"search\",\"search\"],\"args\":[[\"hello\"],[\"world\"],[\"hello\"],[\"hell\"]],\"expected\":[null,null,true,false],\"note\":\"two words, only full words found\"},{\"ops\":[\"insert\",\"search\"],\"args\":[[\"a\"],[\"a\"]],\"expected\":[null,true],\"note\":\"single character word\"},{\"ops\":[\"search\"],\"args\":[[\"anything\"]],\"expected\":[false],\"note\":\"search in empty trie\"}]",
    },
    {
      id: "tr_02",
      title: "Search for a word in a trie",
      description: "Traverse character by character. Return false if any node is missing. Check end marker at last.",
      level: "easy" as QuestionLevel,
      tag: "Trie",
      hint: "Return false if children[ch] does not exist. Return node.isEnd at the end.",
      boilerplate: `class TrieNode {
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
}`,
      test_cases: "[{\"ops\":[\"insert\",\"search\",\"search\",\"search\"],\"args\":[[\"apple\"],[\"apple\"],[\"app\"],[\"ap\"]],\"expected\":[null,true,false,false],\"note\":\"only exact word returns true\"},{\"ops\":[\"insert\",\"insert\",\"search\",\"search\"],\"args\":[[\"app\"],[\"apple\"],[\"app\"],[\"apple\"]],\"expected\":[null,null,true,true],\"note\":\"both prefix and full word inserted\"},{\"ops\":[\"insert\",\"search\"],\"args\":[[\"cat\"],[\"dog\"]],\"expected\":[null,false],\"note\":\"word not in trie\"},{\"ops\":[\"insert\",\"search\",\"search\"],\"args\":[[\"z\"],[\"z\"],[\"zz\"]],\"expected\":[null,true,false],\"note\":\"single char and longer not found\"}]",
    },
    {
      id: "tr_03",
      title: "Check if any word starts with a prefix",
      description: "Same traversal as search but do not check the end-of-word marker — just confirm traversal succeeds.",
      level: "medium" as QuestionLevel,
      tag: "Trie",
      hint: "Return true if you reach the end of the prefix without hitting a missing node.",
      boilerplate: `class TrieNode {
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
}`,
      test_cases: "[{\"ops\":[\"insert\",\"startsWith\",\"startsWith\"],\"args\":[[\"apple\"],[\"app\"],[\"apl\"]],\"expected\":[null,true,false],\"note\":\"valid and invalid prefix\"},{\"ops\":[\"insert\",\"startsWith\",\"startsWith\"],\"args\":[[\"hello\"],[\"hel\"],[\"world\"]],\"expected\":[null,true,false],\"note\":\"prefix exists, different word does not\"},{\"ops\":[\"insert\",\"startsWith\"],\"args\":[[\"abc\"],[\"abc\"]],\"expected\":[null,true],\"note\":\"full word is also a valid prefix\"},{\"ops\":[\"startsWith\"],\"args\":[[\"anything\"]],\"expected\":[false],\"note\":\"prefix search on empty trie\"}]",
    },
    {
      id: "tr_04",
      title: "Count words with a given prefix",
      description: "Reach the prefix end node, then count all isEnd flags in the subtree using DFS.",
      level: "medium" as QuestionLevel,
      tag: "Trie",
      hint: "After traversing to prefix end, run DFS and count nodes where isEnd is true.",
      boilerplate: `class TrieNode {
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
}`,
      test_cases: "[{\"ops\":[\"insert\",\"insert\",\"insert\",\"countPrefix\"],\"args\":[[\"app\"],[\"apple\"],[\"apply\"],[\"app\"]],\"expected\":[null,null,null,3],\"note\":\"app apple apply all start with app\"},{\"ops\":[\"insert\",\"insert\",\"countPrefix\",\"countPrefix\"],\"args\":[[\"hello\"],[\"world\"],[\"hel\"],[\"wor\"]],\"expected\":[null,null,1,1],\"note\":\"one word per prefix\"},{\"ops\":[\"insert\",\"countPrefix\"],\"args\":[[\"test\"],[\"xyz\"]],\"expected\":[null,0],\"note\":\"prefix not found returns 0\"},{\"ops\":[\"insert\",\"insert\",\"insert\",\"countPrefix\"],\"args\":[[\"a\"],[\"ab\"],[\"abc\"],[\"a\"]],\"expected\":[null,null,null,3],\"note\":\"all words share prefix a\"}]",
    },
    {
      id: "tr_05",
      title: "Longest word built character by character",
      description: "Every prefix of the word must also exist in the trie as a complete word.",
      level: "hard" as QuestionLevel,
      tag: "Trie",
      hint: "Insert all words. Then find the longest word where every prefix is a complete word (isEnd = true).",
      boilerplate: `function longestWord(words) {
  // Insert all words into trie
  // For each word, check if every prefix exists as isEnd
  // Return the longest such word (lexicographically smaller if tie)
}`,
      test_cases: "[{\"input\":[[\"w\",\"wo\",\"wor\",\"worl\",\"world\"]],\"expected\":\"world\",\"note\":\"all prefixes present\"},{\"input\":[[\"a\",\"banana\",\"app\",\"appl\",\"ap\",\"apply\",\"apple\"]],\"expected\":\"apple\",\"note\":\"apple wins over apply lexicographically\"},{\"input\":[[\"a\",\"b\",\"c\"]],\"expected\":\"a\",\"note\":\"all single chars, return first\"},{\"input\":[[\"ab\",\"a\"]],\"expected\":\"ab\",\"note\":\"simple two-step build\"}]",
    },
    {
      id: "tr_06",
      title: "Word search II — trie plus backtracking",
      description: "Build a trie from word list. DFS on the grid using the trie to prune invalid paths early.",
      level: "hard" as QuestionLevel,
      tag: "Trie",
      hint: "At each cell, if no trie child exists for that character, backtrack immediately.",
      boilerplate: `function findWords(board, words) {
  // Step 1: build trie from words
  // Step 2: DFS from every cell
  //   track current trie node
  //   if node has no child for board[r][c], return early
  //   if node.isEnd, add word to results
  //   mark cell visited, recurse 4 directions, unmark
  return results;
}`,
      test_cases: "[{\"input\":[[[\"o\",\"a\",\"a\",\"n\"],[\"e\",\"t\",\"a\",\"e\"],[\"i\",\"h\",\"k\",\"r\"],[\"i\",\"f\",\"l\",\"v\"]],[\"oath\",\"pea\",\"eat\",\"rain\"]],\"expected\":[\"oath\",\"eat\"],\"note\":\"standard board search\"},{\"input\":[[[\"a\",\"b\"],[\"c\",\"d\"]],[\"abdc\",\"abcd\",\"abca\"]],\"expected\":[\"abdc\",\"abcd\"],\"note\":\"small board multiple paths\"},{\"input\":[[[\"a\"]],[\"a\"]],\"expected\":[\"a\"],\"note\":\"1x1 board single letter word\"},{\"input\":[[[\"a\",\"b\"],[\"c\",\"d\"]],[\"abdc\"]],\"expected\":[\"abdc\"],\"note\":\"word wraps around the board\"}]",
    },
    {
      id: "sort_01",
      title: "Bubble sort",
      description: "Compare adjacent elements and swap if out of order. Repeat passes until no swaps occur.",
      level: "easy" as QuestionLevel,
      tag: "Sorting Algorithms",
      hint: "After each pass the largest unsorted element bubbles to its correct position.",
      boilerplate: `function bubbleSort(arr) {
  // Step 1: outer loop — n-1 passes
  // Step 2: inner loop — compare arr[j] and arr[j+1]
  // Step 3: swap if arr[j] > arr[j+1]
  // Optimisation: track a swapped flag — if no swaps occurred, array is sorted
  return arr;
}`,
      test_cases: "[{\"input\":[[5,3,1,4,2]],\"expected\":[1,2,3,4,5]},{\"input\":[[1,2,3,4,5]],\"expected\":[1,2,3,4,5]},{\"input\":[[5,4,3,2,1]],\"expected\":[1,2,3,4,5]},{\"input\":[[1]],\"expected\":[1]}]",
    },
    {
      id: "sort_02",
      title: "Selection sort",
      description: "Find the minimum element in the unsorted portion and swap it to the front.",
      level: "easy" as QuestionLevel,
      tag: "Sorting Algorithms",
      hint: "Track minIdx across the inner loop. At the end of each pass, swap arr[i] with arr[minIdx].",
      boilerplate: `function selectionSort(arr) {
  // Step 1: outer loop from 0 to n-2
  // Step 2: inner loop finds the index of minimum in arr[i..n-1]
  // Step 3: swap arr[i] with arr[minIdx]
  return arr;
}`,
      test_cases: "[{\"input\":[[5,3,1,4,2]],\"expected\":[1,2,3,4,5]},{\"input\":[[1]],\"expected\":[1]},{\"input\":[[2,1]],\"expected\":[1,2]},{\"input\":[[3,3,2]],\"expected\":[2,3,3]}]",
    },
    {
      id: "sort_03",
      title: "Insertion sort",
      description: "Take one element at a time and insert it into its correct position in the already-sorted left portion.",
      level: "easy" as QuestionLevel,
      tag: "Sorting Algorithms",
      hint: "key = arr[i]. Shift elements right while they are greater than key. Insert key at the gap.",
      boilerplate: `function insertionSort(arr) {
  // Step 1: outer loop from index 1
  // Step 2: key = arr[i], j = i - 1
  // Step 3: while j >= 0 and arr[j] > key, shift arr[j] right
  // Step 4: place key at arr[j+1]
  return arr;
}`,
      test_cases: "[{\"input\":[[5,3,1,4,2]],\"expected\":[1,2,3,4,5]},{\"input\":[[1,2,3]],\"expected\":[1,2,3]},{\"input\":[[3,2,1]],\"expected\":[1,2,3]},{\"input\":[[1]],\"expected\":[1]}]",
    },
    {
      id: "sort_04",
      title: "Merge sort",
      description: "Divide the array in half recursively until single elements. Merge sorted halves back together.",
      level: "medium" as QuestionLevel,
      tag: "Sorting Algorithms",
      hint: "mergeSort(left) and mergeSort(right) then merge the two sorted halves using two pointers.",
      boilerplate: `function mergeSort(arr) {
  // Base case: arr.length <= 1, return arr
  // Step 1: mid = Math.floor(arr.length / 2)
  // Step 2: left = mergeSort(arr.slice(0, mid))
  // Step 3: right = mergeSort(arr.slice(mid))
  // Step 4: return merge(left, right)
}

function merge(left, right) {
  // Two pointer merge — same as merge two sorted arrays
}`,
      test_cases: "[{\"input\":[[5,3,1,4,2]],\"expected\":[1,2,3,4,5]},{\"input\":[[1]],\"expected\":[1]},{\"input\":[[2,1]],\"expected\":[1,2]},{\"input\":[[5,5,3,1]],\"expected\":[1,3,5,5]}]",
    },
    {
      id: "sort_05",
      title: "Quick sort",
      description: "Pick a pivot. Partition elements smaller than pivot to the left, larger to the right. Recurse on both sides.",
      level: "medium" as QuestionLevel,
      tag: "Sorting Algorithms",
      hint: "Use the last element as pivot. i tracks where the next smaller element should go.",
      boilerplate: `function quickSort(arr, low = 0, high = arr.length - 1) {
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
}`,
      test_cases: "[{\"input\":[[5,3,1,4,2]],\"expected\":[1,2,3,4,5]},{\"input\":[[1]],\"expected\":[1]},{\"input\":[[2,1]],\"expected\":[1,2]},{\"input\":[[3,3,2,1]],\"expected\":[1,2,3,3]}]",
    },
    {
      id: "sort_06",
      title: "Count sort frequency",
      description: "Count element frequencies into a bucket array. Reconstruct sorted array from buckets.",
      level: "hard" as QuestionLevel,
      tag: "Sorting Algorithms",
      hint: "freq[arr[i]]++. Then rebuild arr by writing each value freq[v] times.",
      boilerplate: `function countSort(arr) {
  // Step 1: find max value to size the frequency array
  // Step 2: count frequencies: freq[arr[i]]++
  // Step 3: rebuild arr from freq array
  return arr;
}`,
      test_cases: "[{\"input\":[[4,2,2,8,3,3,1]],\"expected\":[1,2,2,3,3,4,8]},{\"input\":[[1,1,1]],\"expected\":[1,1,1]},{\"input\":[[5,1,3]],\"expected\":[1,3,5]},{\"input\":[[1]],\"expected\":[1]}]",
    },
    {
      id: "tp_01",
      title: "Remove duplicates from sorted array",
      description: "Use a slow pointer to track where the next unique element should go. Fast pointer scans ahead.",
      level: "easy" as QuestionLevel,
      tag: "Two Pointers",
      hint: "If arr[fast] !== arr[slow], increment slow and copy arr[fast] to arr[slow].",
      boilerplate: `function removeDuplicates(arr) {
  // Step 1: slow = 0, fast = 1
  // Step 2: while fast < arr.length
  //   if arr[fast] !== arr[slow], slow++, arr[slow] = arr[fast]
  //   fast++
  // Step 3: return slow + 1 (length of unique portion)
}`,
      test_cases: "[{\"input\":[[1,1,2,3,3,4]],\"expected\":4},{\"input\":[[1,2,3]],\"expected\":3},{\"input\":[[1,1,1]],\"expected\":1},{\"input\":[[1]],\"expected\":1}]",
    },
    {
      id: "tp_02",
      title: "Two sum on sorted array",
      description: "Start pointers at both ends. Move left pointer right if sum is too small, right pointer left if too large.",
      level: "easy" as QuestionLevel,
      tag: "Two Pointers",
      hint: "sum = arr[left] + arr[right]. If sum < target left++. If sum > target right--.",
      boilerplate: `function twoSum(arr, target) {
  // Step 1: left = 0, right = arr.length - 1
  // Step 2: while left < right
  //   sum = arr[left] + arr[right]
  //   if sum === target return [left, right]
  //   if sum < target left++
  //   else right--
  // Step 3: return [] if not found
}`,
      test_cases: "[{\"input\":[[1,2,3,4,6],6],\"expected\":[1,3]},{\"input\":[[1,5,10,20],25],\"expected\":[1,3]},{\"input\":[[1,2],3],\"expected\":[0,1]},{\"input\":[[1,2,3],7],\"expected\":[]}]",
    },
    {
      id: "tp_03",
      title: "Three sum — find all triplets that sum to zero",
      description: "Sort the array. For each element, use two pointers on the rest to find pairs that complete the triplet.",
      level: "medium" as QuestionLevel,
      tag: "Two Pointers",
      hint: "Fix arr[i], then left = i+1, right = n-1. Same two-sum logic on the remaining window.",
      boilerplate: `function threeSum(arr) {
  // Step 1: sort arr
  // Step 2: for each i from 0 to n-3
  //   skip duplicates at i
  //   left = i+1, right = n-1
  //   two pointer on arr[left..right] targeting -arr[i]
  //   skip duplicates at left and right after finding a triplet
  // Step 3: return result
}`,
      test_cases: "[{\"input\":[[-1,0,1,2,-1,-4]],\"expected\":[[-1,-1,2],[-1,0,1]]},{\"input\":[[0,0,0]],\"expected\":[[0,0,0]]},{\"input\":[[1,2,3]],\"expected\":[]},{\"input\":[[-2,0,1,1,2]],\"expected\":[[-2,0,2],[-2,1,1]]}]",
    },
    {
      id: "tp_04",
      title: "Container with most water",
      description: "Two pointers at both ends. Area = min(height[left], height[right]) * (right - left). Always move the shorter side.",
      level: "medium" as QuestionLevel,
      tag: "Two Pointers",
      hint: "Moving the taller side can never increase area. Always move the shorter pointer inward.",
      boilerplate: `function maxWater(heights) {
  // Step 1: left = 0, right = heights.length - 1, maxArea = 0
  // Step 2: while left < right
  //   area = Math.min(heights[left], heights[right]) * (right - left)
  //   maxArea = Math.max(maxArea, area)
  //   if heights[left] < heights[right] left++
  //   else right--
  // Step 3: return maxArea
}`,
      test_cases: "[{\"input\":[[1,8,6,2,5,4,8,3,7]],\"expected\":49},{\"input\":[[1,1]],\"expected\":1},{\"input\":[[4,3,2,1,4]],\"expected\":16},{\"input\":[[1,2,1]],\"expected\":2}]",
    },
    {
      id: "tp_05",
      title: "Trapping rain water",
      description: "Water at index i = min(maxLeft[i], maxRight[i]) - height[i]. Use two pointers to compute this in one pass.",
      level: "hard" as QuestionLevel,
      tag: "Two Pointers",
      hint: "Track leftMax and rightMax. If leftMax < rightMax process the left side, otherwise the right.",
      boilerplate: `function trapWater(heights) {
  // Step 1: left = 0, right = n-1, leftMax = 0, rightMax = 0, water = 0
  // Step 2: while left < right
  //   if heights[left] < heights[right]
  //     if heights[left] >= leftMax, leftMax = heights[left]
  //     else water += leftMax - heights[left]
  //     left++
  //   else do same for right side
  // Step 3: return water
}`,
      test_cases: "[{\"input\":[[0,1,0,2,1,0,1,3,2,1,2,1]],\"expected\":6},{\"input\":[[4,2,0,3,2,5]],\"expected\":9},{\"input\":[[1,0,1]],\"expected\":1},{\"input\":[[3,0,0,2,0,4]],\"expected\":10}]",
    },
    {
      id: "sw_01",
      title: "Maximum sum of subarray of size k",
      description: "Compute the first window sum. Slide right by adding the new element and removing the leftmost.",
      level: "easy" as QuestionLevel,
      tag: "Sliding Window",
      hint: "windowSum = windowSum + arr[right] - arr[right - k]. Track max.",
      boilerplate: `function maxSubarrayOfSizeK(arr, k) {
  // Step 1: compute sum of first window arr[0..k-1]
  // Step 2: slide window from index k to end
  //   add arr[right], subtract arr[right-k]
  //   update maxSum
  // Step 3: return maxSum
}`,
      test_cases: "[{\"input\":[[2,1,5,1,3,2],3],\"expected\":9},{\"input\":[[1,2,3,4,5],2],\"expected\":9},{\"input\":[[1,1,1,1],2],\"expected\":2},{\"input\":[[5],1],\"expected\":5}]",
    },
    {
      id: "sw_02",
      title: "Smallest subarray with sum >= target",
      description: "Expand right to grow the window. Shrink left whenever the sum meets or exceeds target.",
      level: "easy" as QuestionLevel,
      tag: "Sliding Window",
      hint: "While windowSum >= target, update minLen and shrink: windowSum -= arr[left], left++.",
      boilerplate: `function minSubarrayLen(arr, target) {
  // Step 1: left = 0, windowSum = 0, minLen = Infinity
  // Step 2: for right from 0 to n-1
  //   windowSum += arr[right]
  //   while windowSum >= target
  //     minLen = Math.min(minLen, right - left + 1)
  //     windowSum -= arr[left++]
  // Step 3: return minLen === Infinity ? 0 : minLen
}`,
      test_cases: "[{\"input\":[[2,3,1,2,4,3],7],\"expected\":2},{\"input\":[[1,4,4],4],\"expected\":1},{\"input\":[[1,1,1,1,1,1,1,1],11],\"expected\":0},{\"input\":[[1,2,3,4,5],15],\"expected\":5}]",
    },
    {
      id: "sw_03",
      title: "Longest substring with at most k distinct characters",
      description: "Expand right, track character frequencies in a map. When distinct count exceeds k, shrink left.",
      level: "medium" as QuestionLevel,
      tag: "Sliding Window",
      hint: "When freq map size > k, decrement freq[arr[left]] and delete if zero, then left++.",
      boilerplate: `function longestKDistinct(s, k) {
  // Step 1: left = 0, freq = {}, best = 0
  // Step 2: for right from 0 to n-1
  //   add s[right] to freq map
  //   while freq map size > k
  //     decrement freq[s[left]], delete if zero, left++
  //   best = Math.max(best, right - left + 1)
  // Step 3: return best
}`,
      test_cases: "[{\"input\":[\"eceba\",2],\"expected\":3},{\"input\":[\"aa\",1],\"expected\":2},{\"input\":[\"aabbcc\",2],\"expected\":4},{\"input\":[\"abc\",3],\"expected\":3}]",
    },
    {
      id: "sw_04",
      title: "Find all anagrams in a string",
      description: "Use a fixed-size window of length p. Compare character frequencies of window vs pattern.",
      level: "medium" as QuestionLevel,
      tag: "Sliding Window",
      hint: "Build freq maps for p and the first window. Slide and update — add right char, remove left char.",
      boilerplate: `function findAnagrams(s, p) {
  // Step 1: build pFreq from p, wFreq from s[0..p.length-1]
  // Step 2: compare — if equal add 0 to result
  // Step 3: slide window: add s[right], remove s[left]
  //   update wFreq and compare each step
  // Step 4: return result (start indices)
}`,
      test_cases: "[{\"input\":[\"cbaebabacd\",\"abc\"],\"expected\":[0,6]},{\"input\":[\"abab\",\"ab\"],\"expected\":[0,1,2]},{\"input\":[\"aa\",\"bb\"],\"expected\":[]},{\"input\":[\"baa\",\"aa\"],\"expected\":[1]}]",
    },
    {
      id: "sw_05",
      title: "Longest repeating character replacement",
      description: "Window is valid if (windowSize - maxFreq) <= k. Expand right, shrink left when invalid.",
      level: "hard" as QuestionLevel,
      tag: "Sliding Window",
      hint: "Track maxFreq of any character in the window. If windowLen - maxFreq > k, move left.",
      boilerplate: `function characterReplacement(s, k) {
  // Step 1: left = 0, freq = {}, maxFreq = 0, best = 0
  // Step 2: for right from 0 to n-1
  //   freq[s[right]]++, maxFreq = Math.max(maxFreq, freq[s[right]])
  //   while (right - left + 1) - maxFreq > k, freq[s[left]]--, left++
  //   best = Math.max(best, right - left + 1)
  // Step 3: return best
}`,
      test_cases: "[{\"input\":[\"AABABBA\",1],\"expected\":4},{\"input\":[\"ABAB\",2],\"expected\":4},{\"input\":[\"AAAA\",0],\"expected\":4},{\"input\":[\"ABCDE\",1],\"expected\":2}]",
    },
    {
      id: "hash_01",
      title: "Two sum — find indices",
      description: "For each number, check if (target - num) already exists in the map. If yes, you found the pair.",
      level: "easy" as QuestionLevel,
      tag: "Hashing",
      hint: "Store {value: index} in the map. For each element check if target - arr[i] is in the map.",
      boilerplate: `function twoSum(arr, target) {
  // Step 1: create empty map
  // Step 2: for each element, compute complement = target - arr[i]
  // Step 3: if complement exists in map, return [map[complement], i]
  // Step 4: else store map[arr[i]] = i
  // Step 5: return [] if not found
}`,
      test_cases: "[{\"input\":[[2,7,11,15],9],\"expected\":[0,1]},{\"input\":[[3,2,4],6],\"expected\":[1,2]},{\"input\":[[3,3],6],\"expected\":[0,1]},{\"input\":[[1,2,3,4],7],\"expected\":[2,3]}]",
    },
    {
      id: "hash_02",
      title: "Group anagrams together",
      description: "Sort each word as a key. Group words with the same sorted key into the same bucket.",
      level: "easy" as QuestionLevel,
      tag: "Hashing",
      hint: "key = word.split('').sort().join(''). map[key] = map[key] || []. map[key].push(word).",
      boilerplate: `function groupAnagrams(words) {
  // Step 1: create empty map
  // Step 2: for each word, compute key = sorted characters
  // Step 3: push word into map[key] bucket
  // Step 4: return Object.values(map)
}`,
      test_cases: "[{\"input\":[[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]],\"expected\":[[\"eat\",\"tea\",\"ate\"],[\"tan\",\"nat\"],[\"bat\"]]},{\"input\":[[\"\"]],\"expected\":[[\"\"]]},{\"input\":[[\"a\"]],\"expected\":[[\"a\"]]}]",
    },
    {
      id: "hash_03",
      title: "Longest consecutive sequence",
      description: "Add all numbers to a set. For each number that has no left neighbour (n-1 not in set), count how far the sequence extends.",
      level: "medium" as QuestionLevel,
      tag: "Hashing",
      hint: "Only start counting from a sequence start (n-1 not in set). Count n+1, n+2 etc.",
      boilerplate: `function longestConsecutive(nums) {
  // Step 1: add all nums to a Set
  // Step 2: for each num, if num-1 is NOT in set, it is a sequence start
  // Step 3: count streak: while num+streak is in set, streak++
  // Step 4: best = Math.max(best, streak)
  // Step 5: return best
}`,
      test_cases: "[{\"input\":[[100,4,200,1,3,2]],\"expected\":4},{\"input\":[[0,3,7,2,5,8,4,6,0,1]],\"expected\":9},{\"input\":[[1]],\"expected\":1},{\"input\":[[1,2,0,1]],\"expected\":3}]",
    },
    {
      id: "hash_04",
      title: "Subarray sum equals k",
      description: "Use a prefix sum map. For each running sum, check if (sum - k) exists in the map.",
      level: "medium" as QuestionLevel,
      tag: "Hashing",
      hint: "prefixMap[0] = 1. For each sum, count += prefixMap[sum - k]. Then prefixMap[sum]++.",
      boilerplate: `function subarraySum(arr, k) {
  // Step 1: prefixMap = {0: 1}, sum = 0, count = 0
  // Step 2: for each element
  //   sum += arr[i]
  //   count += prefixMap[sum - k] || 0
  //   prefixMap[sum] = (prefixMap[sum] || 0) + 1
  // Step 3: return count
}`,
      test_cases: "[{\"input\":[[1,1,1],2],\"expected\":2},{\"input\":[[1,2,3],3],\"expected\":2},{\"input\":[[1],1],\"expected\":1},{\"input\":[[-1,1,0],0],\"expected\":3}]",
    },
    {
      id: "hash_05",
      title: "Find duplicate in array",
      description: "Add elements to a set one by one. Return the first element already in the set.",
      level: "easy" as QuestionLevel,
      tag: "Hashing",
      hint: "if (seen.has(arr[i])) return arr[i]. else seen.add(arr[i]).",
      boilerplate: `function findDuplicate(arr) {
  // Step 1: create empty Set
  // Step 2: for each element
  //   if already in set, return it
  //   else add to set
  // Step 3: return -1 if no duplicate
}`,
      test_cases: "[{\"input\":[[1,3,4,2,2]],\"expected\":2},{\"input\":[[3,1,3,4,2]],\"expected\":3},{\"input\":[[1,1]],\"expected\":1},{\"input\":[[1,2,3,4,5,6,3]],\"expected\":3}]",
    },
    {
      id: "math_01",
      title: "Check if a number is prime",
      description: "Check divisibility up to the square root of n. If any divisor found, not prime.",
      level: "easy" as QuestionLevel,
      tag: "Math & Basic Problems",
      hint: "Loop i from 2 to Math.sqrt(n). If n % i === 0, return false.",
      boilerplate: `function isPrime(n) {
  // Edge cases: n < 2 is not prime
  // Loop i from 2 to Math.sqrt(n)
  // If n % i === 0, return false
  // Return true
}`,
      test_cases: "[{\"input\":[2],\"expected\":true},{\"input\":[1],\"expected\":false},{\"input\":[17],\"expected\":true},{\"input\":[12],\"expected\":false}]",
    },
    {
      id: "math_02",
      title: "GCD using Euclidean algorithm",
      description: "GCD(a, b) = GCD(b, a % b). Base case is GCD(a, 0) = a.",
      level: "easy" as QuestionLevel,
      tag: "Math & Basic Problems",
      hint: "Keep replacing (a, b) with (b, a % b) until b becomes 0.",
      boilerplate: `function gcd(a, b) {
  // Base case: b === 0, return a
  // Recursive case: return gcd(b, a % b)
}`,
      test_cases: "[{\"input\":[48,18],\"expected\":6},{\"input\":[7,3],\"expected\":1},{\"input\":[100,75],\"expected\":25},{\"input\":[12,12],\"expected\":12}]",
    },
    {
      id: "math_03",
      title: "Reverse digits of an integer",
      description: "Extract digits using modulo and build the reversed number by multiplying by 10 each step.",
      level: "easy" as QuestionLevel,
      tag: "Math & Basic Problems",
      hint: "reversed = reversed * 10 + n % 10. n = Math.floor(n / 10).",
      boilerplate: `function reverseInt(n) {
  // Step 1: reversed = 0
  // Step 2: while n > 0
  //   reversed = reversed * 10 + n % 10
  //   n = Math.floor(n / 10)
  // Step 3: return reversed
}`,
      test_cases: "[{\"input\":[123],\"expected\":321},{\"input\":[120],\"expected\":21},{\"input\":[1],\"expected\":1},{\"input\":[1000],\"expected\":1}]",
    },
    {
      id: "math_04",
      title: "Count set bits in a number",
      description: "Check the last bit with n & 1. Right-shift n by 1 each step until n becomes 0.",
      level: "medium" as QuestionLevel,
      tag: "Math & Basic Problems",
      hint: "count += n & 1. n = n >> 1. Repeat until n === 0.",
      boilerplate: `function countSetBits(n) {
  // Step 1: count = 0
  // Step 2: while n > 0
  //   count += n & 1  (check last bit)
  //   n = n >> 1      (shift right)
  // Step 3: return count
}`,
      test_cases: "[{\"input\":[5],\"expected\":2},{\"input\":[7],\"expected\":3},{\"input\":[0],\"expected\":0},{\"input\":[255],\"expected\":8}]",
    },
    {
      id: "math_05",
      title: "FizzBuzz",
      description: "For each number 1 to n, print Fizz if divisible by 3, Buzz if by 5, FizzBuzz if both, else the number.",
      level: "easy" as QuestionLevel,
      tag: "Math & Basic Problems",
      hint: "Check divisible by 15 first (both), then 3, then 5, else the number itself.",
      boilerplate: `function fizzBuzz(n) {
  const result = [];
  // For i from 1 to n:
  //   if i % 15 === 0, push 'FizzBuzz'
  //   else if i % 3 === 0, push 'Fizz'
  //   else if i % 5 === 0, push 'Buzz'
  //   else push String(i)
  return result;
}`,
      test_cases: "[{\"input\":[5],\"expected\":[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]},{\"input\":[15],\"expected\":[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\",\"Fizz\",\"7\",\"8\",\"Fizz\",\"Buzz\",\"11\",\"Fizz\",\"13\",\"14\",\"FizzBuzz\"]},{\"input\":[1],\"expected\":[\"1\"]},{\"input\":[3],\"expected\":[\"1\",\"2\",\"Fizz\"]}]",
    },
    {
      id: "graph_01",
      title: "BFS on a graph",
      description: "Start from a source node. Use a queue — visit all neighbours before going deeper.",
      level: "easy" as QuestionLevel,
      tag: "Graphs",
      hint: "Enqueue source. While queue not empty, dequeue, visit, enqueue unvisited neighbours.",
      boilerplate: `function bfs(graph, start) {
  const visited = new Set([start]);
  const queue = [start];
  const order = [];
  while (queue.length > 0) {
    // Dequeue front node
    // Push to order
    // For each neighbour: if not visited, mark visited and enqueue
  }
  return order;
}`,
      test_cases: "[{\"input\":[{\"0\":[\"1\",\"2\"],\"1\":[\"3\"],\"2\":[\"3\"],\"3\":[]},\"0\"],\"expected\":[\"0\",\"1\",\"2\",\"3\"]},{\"input\":[{\"0\":[\"1\"],\"1\":[\"2\"],\"2\":[]},\"0\"],\"expected\":[\"0\",\"1\",\"2\"]},{\"input\":[{\"0\":[]},\"0\"],\"expected\":[\"0\"]}]",
    },
    {
      id: "graph_02",
      title: "DFS on a graph",
      description: "Start from a source node. Go as deep as possible before backtracking.",
      level: "easy" as QuestionLevel,
      tag: "Graphs",
      hint: "Mark node visited, push to order. For each unvisited neighbour, recurse.",
      boilerplate: `function dfs(graph, start) {
  const visited = new Set();
  const order = [];
  function explore(node) {
    // Mark visited, push to order
    // For each neighbour of node: if not visited, recurse
  }
  explore(start);
  return order;
}`,
      test_cases: "[{\"input\":[{\"0\":[\"1\",\"2\"],\"1\":[\"3\"],\"2\":[\"4\"],\"3\":[],\"4\":[]},\"0\"],\"expected\":[\"0\",\"1\",\"3\",\"2\",\"4\"]},{\"input\":[{\"0\":[\"1\"],\"1\":[]},\"0\"],\"expected\":[\"0\",\"1\"]},{\"input\":[{\"0\":[]},\"0\"],\"expected\":[\"0\"]}]",
    },
    {
      id: "graph_03",
      title: "Number of islands",
      description: "For each unvisited land cell, run DFS to mark the whole island as visited. Count how many DFS calls you make.",
      level: "medium" as QuestionLevel,
      tag: "Graphs",
      hint: "When you hit a '1', increment count and DFS in all 4 directions marking '0' as you go.",
      boilerplate: `function numIslands(grid) {
  let count = 0;
  function dfs(r, c) {
    // If out of bounds or grid[r][c] === '0', return
    // Mark grid[r][c] = '0'
    // DFS in all 4 directions
  }
  // For each cell, if '1', count++ and dfs(r, c)
  return count;
}`,
      test_cases: "[{\"input\":[[[\"1\",\"1\",\"0\",\"0\"],[\"1\",\"1\",\"0\",\"0\"],[\"0\",\"0\",\"1\",\"0\"],[\"0\",\"0\",\"0\",\"1\"]]],\"expected\":3},{\"input\":[[[\"1\",\"1\",\"1\"],[\"0\",\"1\",\"0\"],[\"1\",\"1\",\"1\"]]],\"expected\":1},{\"input\":[[[\"0\"]]],\"expected\":0},{\"input\":[[[\"1\"]]],\"expected\":1}]",
    },
    {
      id: "graph_04",
      title: "Detect cycle in undirected graph",
      description: "Use BFS or DFS. Track the parent of each node. If you visit a neighbour that is visited and not the parent, there is a cycle.",
      level: "medium" as QuestionLevel,
      tag: "Graphs",
      hint: "In DFS: if neighbour is visited and neighbour !== parent, cycle detected.",
      boilerplate: `function hasCycle(graph, n) {
  const visited = new Set();
  function dfs(node, parent) {
    // Mark visited
    // For each neighbour:
    //   if not visited, recurse — if it returns true, return true
    //   if visited and neighbour !== parent, return true (cycle)
    // Return false
  }
  // Run dfs from each unvisited node
  return false;
}`,
      test_cases: "[{\"input\":[{\"0\":[\"1\",\"2\"],\"1\":[\"0\",\"2\"],\"2\":[\"0\",\"1\"]},3],\"expected\":true},{\"input\":[{\"0\":[\"1\"],\"1\":[\"0\",\"2\"],\"2\":[\"1\"]},3],\"expected\":false},{\"input\":[{\"0\":[\"1\"],\"1\":[\"0\"]},2],\"expected\":false}]",
    },
    {
      id: "graph_05",
      title: "Shortest path in unweighted graph — BFS",
      description: "BFS guarantees shortest path in an unweighted graph. Track distance from source to each node.",
      level: "hard" as QuestionLevel,
      tag: "Graphs",
      hint: "dist[start] = 0. When visiting a neighbour, dist[neighbour] = dist[node] + 1.",
      boilerplate: `function shortestPath(graph, start, end) {
  const dist = {};
  dist[start] = 0;
  const queue = [start];
  while (queue.length > 0) {
    // Dequeue node
    // For each neighbour: if dist not set, dist[neighbour] = dist[node]+1, enqueue
  }
  return dist[end] !== undefined ? dist[end] : -1;
}`,
      test_cases: "[{\"input\":[{\"0\":[\"1\",\"2\"],\"1\":[\"0\",\"3\"],\"2\":[\"0\",\"3\"],\"3\":[\"1\",\"2\"]},\"0\",\"3\"],\"expected\":2},{\"input\":[{\"0\":[\"1\"],\"1\":[\"2\"],\"2\":[]},\"0\",\"2\"],\"expected\":2},{\"input\":[{\"0\":[\"1\"],\"1\":[]},\"0\",\"2\"],\"expected\":-1}]",
    },
  ];

export const QUESTION_BY_ID: Record<string, Question> = Object.fromEntries(
  QUESTIONS.map((q) => [q.id, q])
);

/** Tab order: Arrays first, then remaining tags alphabetically */
export const CATEGORY_ORDER = [
  "Arrays",
  "Linked List",
  "Stack & Queue",
  "Strings",
  "Binary Search",
  "Recursion",
  "Backtracking",
  "Greedy",
  "Heaps",
  "Binary Tree",
  "BST",
  "Dynamic Programming",
  "Trie",
  "Sorting Algorithms",
  "Two Pointers",
  "Sliding Window",
  "Hashing",
  "Math & Basic Problems",
  "Graphs",
] as const;

export function questionsByTag(tag: string): Question[] {
  return QUESTIONS.filter((q) => q.tag === tag);
}

export function countByTag(): Map<string, number> {
  const m = new Map<string, number>();
  for (const q of QUESTIONS) {
    m.set(q.tag, (m.get(q.tag) ?? 0) + 1);
  }
  return m;
}
